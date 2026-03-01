"""
GigBounty — FastAPI Backend
Decentralized Micro-Task Bounty Board
"""

import os
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from models import (
    TaskCreate, TaskClaim, TaskSubmitProof,
    TaskApprove, TaskRelease, TaskCancel, TaskDispute, TaskResponse
)
import database as db
from escrow import verify_payment, release_payment, refund_payment, get_escrow_info
from ai_verify import verify_proof
from auth import get_authenticated_wallet, require_wallet_ownership

load_dotenv()

app = FastAPI(
    title="GigBounty API",
    description="Decentralized Micro-Task Bounty Board API",
    version="2.0.0"
)

# CORS — use env variable or defaults
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000")
allowed_origins = [origin.strip() for origin in CORS_ORIGINS.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "GigBounty API is running", "version": "2.0.0"}


# ─── GET /escrow/info ─────────────────────────────────────────
@app.get("/escrow/info")
async def escrow_info():
    """Get escrow wallet address, balance, and fee info."""
    return get_escrow_info()


# ─── GET /wallet/{address}/role ───────────────────────────────
@app.get("/wallet/{address}/role")
async def get_role(address: str):
    """Get role for a wallet address."""
    role = db.get_wallet_role(address)
    return {"role": role}


# ─── POST /wallet/role ────────────────────────────────────────
@app.post("/wallet/role")
async def set_role(request: Request):
    """Set or update role for a wallet address."""
    body = await request.json()
    address = body.get("wallet_address")
    role = body.get("role")
    if not address:
        raise HTTPException(status_code=400, detail="wallet_address is required")
    if role not in ("poster", "acceptor"):
        raise HTTPException(status_code=400, detail="role must be 'poster' or 'acceptor'")
    db.set_wallet_role(address, role)
    return {"wallet_address": address, "role": role}


# ─── GET /tasks ───────────────────────────────────────────────
@app.get("/tasks", response_model=list[TaskResponse])
async def get_tasks():
    """Get all tasks, newest first."""
    return db.get_all_tasks()


# ─── GET /tasks/{task_id} ─────────────────────────────────────
@app.get("/tasks/{task_id}", response_model=TaskResponse)
async def get_task(task_id: str):
    """Get a single task by ID."""
    task = db.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


# ─── POST /task/create ────────────────────────────────────────
@app.post("/task/create", response_model=TaskResponse)
async def create_task(
    data: TaskCreate,
    wallet: str = Depends(get_authenticated_wallet)
):
    """Create a new task with escrowed ALGO."""
    # Auth: verify caller is the creator
    require_wallet_ownership(wallet, data.creator_wallet)

    # Verify escrow payment
    payment = verify_payment(data.creator_wallet, data.amount, data.tx_id)
    if not payment["verified"]:
        raise HTTPException(status_code=400, detail=payment["message"])

    task = db.create_task(
        title=data.title,
        description=data.description,
        amount=data.amount,
        creator_wallet=data.creator_wallet,
        deadline=data.deadline,
    )

    # Store transaction ID
    db.update_task(task["id"], {"tx_id": payment["tx_id"]})
    task["tx_id"] = payment["tx_id"]

    return task


# ─── POST /task/claim ─────────────────────────────────────────
@app.post("/task/claim", response_model=TaskResponse)
async def claim_task(
    data: TaskClaim,
    wallet: str = Depends(get_authenticated_wallet)
):
    """Claim an open task."""
    # Auth: verify caller is the worker
    require_wallet_ownership(wallet, data.worker_wallet)

    task = db.get_task(data.task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task["status"] != "OPEN":
        raise HTTPException(status_code=400, detail=f"Task is not open (status: {task['status']})")

    if task["creator_wallet"] == data.worker_wallet:
        raise HTTPException(status_code=400, detail="Cannot claim your own task")

    updated = db.update_task(data.task_id, {
        "worker_wallet": data.worker_wallet,
        "status": "CLAIMED"
    })

    return updated


# ─── POST /task/submit-proof ──────────────────────────────────
@app.post("/task/submit-proof", response_model=TaskResponse)
async def submit_proof(data: TaskSubmitProof):
    """Submit proof of task completion."""
    task = db.get_task(data.task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task["status"] != "CLAIMED":
        raise HTTPException(status_code=400, detail=f"Task is not claimed (status: {task['status']})")

    updated = db.update_task(data.task_id, {
        "proof_url": data.proof_url,
        "status": "SUBMITTED"
    })

    # Optional: AI auto-verification
    if data.ai_verify:
        ai_result = await verify_proof(task["description"], data.proof_url)
        if ai_result["verdict"] == "PASS":
            # Auto-approve and release payment
            payout = release_payment(task["worker_wallet"], task["amount"])
            if payout["success"]:
                updated = db.update_task(data.task_id, {
                    "status": "COMPLETED",
                    "tx_id": payout["tx_id"]
                })

    return updated


# ─── POST /task/approve ───────────────────────────────────────
@app.post("/task/approve", response_model=TaskResponse)
async def approve_task(
    data: TaskApprove,
    wallet: str = Depends(get_authenticated_wallet)
):
    """Approve task and release payment. Only the task creator can approve."""
    task = db.get_task(data.task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Auth: only creator can approve
    require_wallet_ownership(wallet, task["creator_wallet"])

    if task["status"] != "SUBMITTED":
        raise HTTPException(status_code=400, detail=f"Task is not submitted (status: {task['status']})")

    if not task["worker_wallet"]:
        raise HTTPException(status_code=400, detail="No worker assigned")

    # Release payment from escrow
    payout = release_payment(task["worker_wallet"], task["amount"])

    if not payout["success"]:
        raise HTTPException(status_code=500, detail=payout["message"])

    updated = db.update_task(data.task_id, {
        "status": "COMPLETED",
        "tx_id": payout["tx_id"]
    })

    return updated


# ─── POST /task/cancel ────────────────────────────────────────
@app.post("/task/cancel", response_model=TaskResponse)
async def cancel_task(
    data: TaskCancel,
    wallet: str = Depends(get_authenticated_wallet)
):
    """
    Cancel a task and refund the creator.
    Only allowed if the task is OPEN (unclaimed).
    """
    # Auth: verify caller is the one requesting
    require_wallet_ownership(wallet, data.caller_wallet)

    task = db.get_task(data.task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Only the creator can cancel
    if task["creator_wallet"] != data.caller_wallet:
        raise HTTPException(status_code=403, detail="Only the task creator can cancel")

    # Can only cancel OPEN tasks (not yet claimed)
    if task["status"] != "OPEN":
        raise HTTPException(
            status_code=400,
            detail=f"Cannot cancel — task is {task['status']}. Only OPEN tasks can be cancelled."
        )

    # Refund the creator
    refund = refund_payment(task["creator_wallet"], task["amount"])

    if not refund["success"]:
        raise HTTPException(status_code=500, detail=refund["message"])

    updated = db.update_task(data.task_id, {
        "status": "CANCELLED",
        "tx_id": refund.get("tx_id")
    })

    return updated


# ─── POST /task/dispute ───────────────────────────────────────
@app.post("/task/dispute", response_model=TaskResponse)
async def dispute_task(
    data: TaskDispute,
    wallet: str = Depends(get_authenticated_wallet)
):
    """
    Raise a dispute on a task.
    Either the creator or worker can dispute a CLAIMED or SUBMITTED task.
    """
    # Auth: verify caller identity
    require_wallet_ownership(wallet, data.caller_wallet)

    task = db.get_task(data.task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Only creator or worker can dispute
    is_creator = task["creator_wallet"] == data.caller_wallet
    is_worker = task.get("worker_wallet") == data.caller_wallet

    if not is_creator and not is_worker:
        raise HTTPException(status_code=403, detail="Only the creator or worker can dispute this task")

    # Can only dispute CLAIMED or SUBMITTED tasks
    if task["status"] not in ("CLAIMED", "SUBMITTED"):
        raise HTTPException(
            status_code=400,
            detail=f"Cannot dispute — task is {task['status']}. Only CLAIMED or SUBMITTED tasks can be disputed."
        )

    updated = db.update_task(data.task_id, {
        "status": "DISPUTED",
        "dispute_reason": data.reason,
        "disputed_by": data.caller_wallet,
    })

    return updated


# ─── POST /task/release-payment ───────────────────────────────
@app.post("/task/release-payment")
async def release_task_payment(
    data: TaskRelease,
    wallet: str = Depends(get_authenticated_wallet)
):
    """Manually release payment for a task."""
    task = db.get_task(data.task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Auth: only creator can release payment
    require_wallet_ownership(wallet, task["creator_wallet"])

    if task["status"] == "COMPLETED":
        raise HTTPException(status_code=400, detail="Payment already released")

    if not task["worker_wallet"]:
        raise HTTPException(status_code=400, detail="No worker assigned")

    payout = release_payment(task["worker_wallet"], task["amount"])

    if not payout["success"]:
        raise HTTPException(status_code=500, detail=payout["message"])

    updated = db.update_task(data.task_id, {
        "status": "COMPLETED",
        "tx_id": payout["tx_id"]
    })

    return {
        "task": updated,
        "payout": payout
    }


# ─── POST /task/ai-verify ────────────────────────────────────
@app.post("/task/ai-verify")
async def ai_verify_task(data: TaskApprove):
    """Run AI verification on a submitted task."""
    task = db.get_task(data.task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task["status"] != "SUBMITTED":
        raise HTTPException(status_code=400, detail="Task must be in SUBMITTED status")

    result = await verify_proof(task["description"], task.get("proof_url", ""))

    return {
        "task_id": data.task_id,
        "ai_result": result
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

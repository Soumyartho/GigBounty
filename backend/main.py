"""
GigBounty — FastAPI Backend
Decentralized Micro-Task Bounty Board
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import (
    TaskCreate, TaskClaim, TaskSubmitProof,
    TaskApprove, TaskRelease, TaskResponse
)
import database as db
from escrow import verify_payment, release_payment
from ai_verify import verify_proof

app = FastAPI(
    title="GigBounty API",
    description="Decentralized Micro-Task Bounty Board API",
    version="1.0.0"
)

# CORS — allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "GigBounty API is running", "version": "1.0.0"}


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
async def create_task(data: TaskCreate):
    """Create a new task with escrowed ALGO."""
    # Verify escrow payment
    payment = verify_payment(data.creator_wallet, data.amount)
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
async def claim_task(data: TaskClaim):
    """Claim an open task."""
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
async def approve_task(data: TaskApprove):
    """Approve task and release payment."""
    task = db.get_task(data.task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

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


# ─── POST /task/release-payment ───────────────────────────────
@app.post("/task/release-payment")
async def release_task_payment(data: TaskRelease):
    """Manually release payment for a task."""
    task = db.get_task(data.task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

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

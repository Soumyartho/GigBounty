from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum


class TaskStatus(str, Enum):
    OPEN = "OPEN"
    CLAIMED = "CLAIMED"
    SUBMITTED = "SUBMITTED"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"
    EXPIRED = "EXPIRED"
    DISPUTED = "DISPUTED"


# ─── Request Models ──────────────────────────────────────────


class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1, max_length=2000)
    amount: float = Field(..., gt=0)
    creator_wallet: str = Field(..., min_length=10)
    deadline: Optional[str] = None
    tx_id: Optional[str] = None


class TaskClaim(BaseModel):
    task_id: str
    worker_wallet: str = Field(..., min_length=10)


class TaskSubmitProof(BaseModel):
    task_id: str
    proof_url: str = Field(..., min_length=1)
    ai_verify: bool = False


class TaskApprove(BaseModel):
    task_id: str


class TaskRelease(BaseModel):
    task_id: str


class TaskCancel(BaseModel):
    """Cancel an open/unclaimed task and refund the creator."""
    task_id: str
    caller_wallet: str = Field(..., min_length=10)


class TaskDispute(BaseModel):
    """Raise a dispute on a submitted task."""
    task_id: str
    caller_wallet: str = Field(..., min_length=10)
    reason: str = Field(..., min_length=5, max_length=1000)


# ─── Response Models ─────────────────────────────────────────


class TaskResponse(BaseModel):
    id: str
    title: str
    description: str
    amount: float
    creator_wallet: str
    worker_wallet: Optional[str] = None
    status: TaskStatus = TaskStatus.OPEN
    proof_url: Optional[str] = None
    created_at: str
    deadline: Optional[str] = None
    tx_id: Optional[str] = None
    dispute_reason: Optional[str] = None
    disputed_by: Optional[str] = None


class AIVerifyResponse(BaseModel):
    score: float
    verdict: str  # "PASS" or "FAIL"
    reasoning: Optional[str] = None

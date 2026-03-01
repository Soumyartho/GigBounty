import json
import os
import uuid
from datetime import datetime
from typing import Optional

DB_FILE = os.path.join(os.path.dirname(__file__), "tasks_db.json")
ROLES_FILE = os.path.join(os.path.dirname(__file__), "wallet_roles.json")

# In-memory databases
_tasks: dict = {}
_wallet_roles: dict = {}  # { wallet_address: 'poster' | 'acceptor' }


def _load_db():
    """Load tasks from JSON file on startup."""
    global _tasks
    if os.path.exists(DB_FILE):
        try:
            with open(DB_FILE, "r") as f:
                data = json.load(f)
                _tasks = {t["id"]: t for t in data}
        except (json.JSONDecodeError, KeyError):
            _tasks = {}


def _save_db():
    """Persist tasks to JSON file."""
    with open(DB_FILE, "w") as f:
        json.dump(list(_tasks.values()), f, indent=2, default=str)


def create_task(
    title: str,
    description: str,
    amount: float,
    creator_wallet: str,
    deadline: Optional[str] = None,
) -> dict:
    """Create a new task."""
    task_id = str(uuid.uuid4())[:8]
    task = {
        "id": task_id,
        "title": title,
        "description": description,
        "amount": amount,
        "creator_wallet": creator_wallet,
        "worker_wallet": None,
        "status": "OPEN",
        "proof_url": None,
        "created_at": datetime.utcnow().isoformat(),
        "deadline": deadline,
        "tx_id": None,
    }
    _tasks[task_id] = task
    _save_db()
    return task


def get_all_tasks() -> list:
    """Get all tasks, newest first."""
    return sorted(_tasks.values(), key=lambda t: t["created_at"], reverse=True)


def get_task(task_id: str) -> Optional[dict]:
    """Get a single task by ID."""
    return _tasks.get(task_id)


def update_task(task_id: str, updates: dict) -> Optional[dict]:
    """Update task fields."""
    if task_id not in _tasks:
        return None
    _tasks[task_id].update(updates)
    _save_db()
    return _tasks[task_id]



def delete_task(task_id: str) -> bool:
    """Delete a task."""
    if task_id in _tasks:
        del _tasks[task_id]
        _save_db()
        return True
    return False


# ─── Wallet Roles ─────────────────────────────────────────────

def _load_roles():
    """Load wallet roles from JSON file on startup."""
    global _wallet_roles
    if os.path.exists(ROLES_FILE):
        try:
            with open(ROLES_FILE, "r") as f:
                _wallet_roles = json.load(f)
        except (json.JSONDecodeError, TypeError):
            _wallet_roles = {}


def _save_roles():
    """Persist wallet roles to JSON file."""
    with open(ROLES_FILE, "w") as f:
        json.dump(_wallet_roles, f, indent=2)


def get_wallet_role(address: str) -> Optional[str]:
    """Get role for a wallet address ('poster' | 'acceptor' | None)."""
    return _wallet_roles.get(address)


def set_wallet_role(address: str, role: str) -> str:
    """Set role for a wallet address."""
    _wallet_roles[address] = role
    _save_roles()
    return role


# Load on import
_load_db()
_load_roles()

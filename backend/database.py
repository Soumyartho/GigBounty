import json
import os
import uuid
from datetime import datetime
from typing import Optional

DB_FILE = os.path.join(os.path.dirname(__file__), "tasks_db.json")

# In-memory database
_tasks: dict = {}


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


# Load on import
_load_db()

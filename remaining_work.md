# GigBounty — Remaining Work Checklist

> Based on the audit in `blockchain_audit.md.resolved`, cross-referenced against every file on the local machine.  
> **Date:** 2026-02-28

---

## Summary

### ✅ What IS Present Locally

| Feature | File(s) | Notes |
|---------|---------|-------|
| Escrow wallet (mnemonic) | `backend/.env` | TestNet wallet configured |
| Deposit flow (user → escrow) | `frontend/src/services/algorand.js` | Builds `PaymentTxn` via `algosdk`, signed via Pera Wallet |
| Payout flow (escrow → worker) | `backend/escrow.py` → `release_payment()` | Signs tx with escrow private key, sends to worker |
| 3% platform fee | `backend/escrow.py` lines 132–133 | Fee deducted before payout |
| AI verification (optional) | `backend/ai_verify.py` | Groq LLaMA auto-scores proofs; demo fallback if no API key |
| Demo mode fallback | `backend/escrow.py` → `verify_payment()` | Returns `verified: True` when no SDK/mnemonic |
| TestNet test script | `backend/test_escrow_deposit.py` | End-to-end deposit test |
| Balance checking | `backend/escrow.py` → `get_escrow_balance()` + `frontend/src/services/algorand.js` → `getBalance()` | Queries Algod |
| Frontend pages | `frontend/src/pages/` | Home, BountyBoard, PostTask, TaskDetail, Wallet, Leaderboard, About, ForBusiness, NotFound |
| Frontend components | `frontend/src/components/` | Navbar, Footer, TaskBoard, TaskCard, PostTaskForm, SubmitProofModal, HeroBlock, etc. |
| API service layer | `frontend/src/services/api.js` | Wraps all backend endpoints |
| Backend REST API | `backend/main.py` | FastAPI with CORS, all CRUD + approve + release + AI-verify endpoints |
| Data models | `backend/models.py` | Pydantic models for TaskCreate, TaskClaim, TaskSubmitProof, TaskApprove, TaskRelease, TaskResponse |

---

### ❌ What Is NOT Present — Work To Be Done

Items are grouped by the phases recommended in the audit document.

---

## Phase 1: Fix Critical Escrow Gaps

### 1. Real Transaction Verification (🔴 CRITICAL)

**Current state:** `verify_payment()` in `backend/escrow.py` (lines 56–101) only calls `client.account_info(escrow_addr)` — it checks if the escrow account **exists**, not whether the specific `tx_id` is valid.

**What needs to be built:**
- [ ] Use the **Algorand Indexer** to look up the `tx_id` on-chain
- [ ] Verify `sender == creator_wallet`
- [ ] Verify `receiver == escrow_address`
- [ ] Verify `amount >= task.amount`
- [ ] Verify the transaction is **confirmed** (not pending)
- [ ] Add `INDEXER_SERVER` / `INDEXER_TOKEN` to `.env`
- [ ] Add `py-algorand-sdk` Indexer client usage (the SDK already supports it)

**Files to modify:** `backend/escrow.py`, `backend/.env`

---

### 2. Refund / Cancel Mechanism (🟡 HIGH)

**Current state:** No refund logic exists anywhere in the codebase. If a task is never claimed or the worker abandons, the creator's ALGO is locked forever.

**What needs to be built:**
- [ ] Add `CANCELLED` / `EXPIRED` status to `TaskStatus` enum in `backend/models.py`
- [ ] Create a `POST /task/cancel` endpoint in `backend/main.py`
- [ ] Implement `refund_payment()` function in `backend/escrow.py` (escrow → creator)
- [ ] Add deadline-based auto-expiry logic (optional cron / background task)
- [ ] Add Cancel/Refund button in `frontend/src/pages/TaskDetailPage.jsx`
- [ ] Add `cancelTask()` / `refundTask()` to `frontend/src/services/api.js`

**Files to create/modify:** `backend/models.py`, `backend/main.py`, `backend/escrow.py`, `frontend/src/services/api.js`, `frontend/src/pages/TaskDetailPage.jsx`

---

### 3. API Authorization / Authentication (🟡 HIGH)

**Current state:** Zero authentication. Any user can call any endpoint — approve someone else's task, release someone else's payment, etc. The only "auth" is the Groq API key header in `ai_verify.py`.

**What needs to be built:**
- [ ] Wallet-signature-based authentication (EIP-4361 / Sign-In-With-Algorand style)
- [ ] Verify that the calling wallet **owns** the task before allowing approve/release/cancel
- [ ] Add middleware or dependency injection for wallet auth in FastAPI
- [ ] Pass wallet signature from frontend on mutating API calls

**Files to create/modify:** `backend/main.py` (middleware), new `backend/auth.py` module, `frontend/src/services/api.js`

---

### 4. Replace JSON File Database (🟡 HIGH)

**Current state:** `backend/database.py` uses `tasks_db.json` — a flat JSON file with no concurrent access safety, no persistence guarantees, and single-server only.

**What needs to be built:**
- [ ] Migrate to **SQLite** (minimum) or **PostgreSQL** (production)
- [ ] Rewrite `database.py` to use an ORM (e.g. SQLAlchemy) or raw SQL
- [ ] Add database migration script
- [ ] Ensure concurrent access safety

**Files to create/modify:** `backend/database.py`, new migration script, `backend/requirements.txt`

---

### 5. Double-Spend Protection (🟡 HIGH)

**Current state:** A creator could submit a fake or reused `tx_id` and the backend would still create the task (demo mode bypass in `verify_payment()`).

**What needs to be built:**
- [ ] Track used `tx_id`s in the database to prevent reuse
- [ ] Reject task creation if `tx_id` has already been used
- [ ] Remove demo-mode auto-verify bypass (or restrict to a dev flag)

**Files to modify:** `backend/escrow.py`, `backend/database.py`, `backend/main.py`

---

## Phase 2: Smart Contract Escrow

### 6. PyTEAL / Beaker Escrow Smart Contract (🔴 CRITICAL for Plugin)

**Current state:** No smart contract code exists anywhere. The escrow is a **custodial wallet** — the backend holds the private key. The operator could drain the wallet.

**What needs to be built:**
- [ ] Write a **PyTEAL escrow contract** with on-chain logic:
  - Lock funds with multi-sig release conditions
  - Auto-refund on timeout
  - Trustless — no single party can drain funds
- [ ] Compile and deploy the contract to TestNet
- [ ] Update `backend/escrow.py` to interact with the smart contract instead of a raw wallet
- [ ] Update frontend to interact with the contract (Application calls instead of raw payments)

**Files to create:** New `backend/contracts/` directory with PyTEAL code  
**Files to modify:** `backend/escrow.py`, `frontend/src/services/algorand.js`

---

### 7. Dispute Resolution Flow (🟡 HIGH)

**Current state:** No `DISPUTED` status, no dispute endpoints, no UI for disputes. If a creator refuses to approve valid work, the worker has no recourse.

**What needs to be built:**
- [ ] Add `DISPUTED` status to `TaskStatus` enum
- [ ] Create `POST /task/dispute` endpoint
- [ ] Implement dispute resolution logic (e.g., timeout-based auto-release, or third-party arbitration)
- [ ] Add dispute UI in `TaskDetailPage.jsx`

**Files to modify:** `backend/models.py`, `backend/main.py`, `frontend/src/pages/TaskDetailPage.jsx`, `frontend/src/services/api.js`

---

## Phase 3: Build the Plugin / Embeddable Widget

### 8. Embeddable JS SDK

**Current state:** Does not exist.

- [ ] Create a lightweight `gigbounty-widget.js` script tag SDK
- [ ] Build an iframe or Web Component for embedding
- [ ] Include Pera Wallet Connect, task creation UI, and escrow deposit flow

---

### 9. Multi-Tenant API

**Current state:** Single-instance, no partner support.

- [ ] Partner API key management
- [ ] Per-partner fee configuration / fee splits
- [ ] Per-partner CORS / domain whitelisting (currently wildcard `*`)

---

### 10. Documentation

**Current state:** No API docs or integration guides exist.

- [ ] API reference documentation
- [ ] Integration guide for freelancing platforms
- [ ] Setup / deployment guide

---

## Minor Issues Also Noted

| Issue | Severity | Location | Fix |
|-------|----------|----------|-----|
| `Buffer` usage in browser | 🟠 MEDIUM | `frontend/src/services/algorand.js` line 62 | Replace `Buffer.from(...)` with `new TextEncoder().encode(...)` |
| Escrow mnemonic stored in `.env` | 🟠 MEDIUM | `backend/.env` | Acceptable for hackathon; use KMS/HSM for production |
| CORS wildcard `*` | 🟠 MEDIUM | `backend/main.py` line 25 | Restrict to known origins for production |

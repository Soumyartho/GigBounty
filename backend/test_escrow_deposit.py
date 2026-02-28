"""
GigBounty — Full Escrow Test Script
Generates wallets, funds them via the Lora Dispenser API, and tests the full flow.

USAGE:
  1. Make sure the backend is running: python main.py
  2. Run this script: python test_escrow_deposit.py

This script will:
  - Read the escrow mnemonic from .env
  - Generate a fresh user wallet
  - Build a real TestNet payment transaction (user → escrow)
  - Submit it to the Algorand TestNet
  - Call the backend API to create a task with the tx_id
"""

import os
import requests
from dotenv import load_dotenv
from algosdk import account, mnemonic, transaction
from algosdk.v2client import algod

load_dotenv()

# ─── Configuration ────────────────────────────────────────────
ALGOD_SERVER = "https://testnet-api.algonode.cloud"
client = algod.AlgodClient("", ALGOD_SERVER)

# ─── Escrow Wallet (from .env) ────────────────────────────────
ESCROW_MNEMONIC = os.getenv("ESCROW_MNEMONIC", "").strip()
if not ESCROW_MNEMONIC:
    print("❌ ESCROW_MNEMONIC is empty in .env! Run create_escrow.py first.")
    exit(1)

escrow_pk = mnemonic.to_private_key(ESCROW_MNEMONIC)
escrow_address = account.address_from_private_key(escrow_pk)

# ─── User Wallet (generate fresh one for testing) ─────────────
user_pk_key, user_address = account.generate_account()
user_phrase = mnemonic.from_private_key(user_pk_key)

print("=" * 60)
print("  GigBounty — Escrow Deposit Test")
print("=" * 60)
print(f"  Escrow:  {escrow_address}")
print(f"  User:    {user_address}")
print(f"  Network: TestNet (AlgoNode)")
print("=" * 60)

# ─── Check Balances ───────────────────────────────────────────
def get_balance(addr):
    try:
        info = client.account_info(addr)
        return info.get("amount", 0) / 1_000_000
    except:
        return 0

escrow_bal = get_balance(escrow_address)
user_bal = get_balance(user_address)

print(f"\n  Escrow balance:  {escrow_bal} ALGO")
print(f"  User balance:    {user_bal} ALGO")

if user_bal < 2:
    print(f"\n⚠️  User wallet has insufficient funds ({user_bal} ALGO)")
    print(f"   Fund this address at the Lora Dispenser:")
    print(f"   https://lora.algokit.io/testnet/fund")
    print(f"   Address: {user_address}")
    print(f"\n   Or fund it directly from another wallet.")
    print(f"\n   After funding, re-run this script.")
    exit(0)

# ─── Build & Submit Transaction ───────────────────────────────
amount_algo = 2.0
amount_microalgos = int(amount_algo * 1_000_000)

print(f"\n[1] Building {amount_algo} ALGO payment: User → Escrow...")
params = client.suggested_params()
txn = transaction.PaymentTxn(
    sender=user_address,
    sp=params,
    receiver=escrow_address,
    amt=amount_microalgos,
    note=b"GigBounty Escrow Deposit (Test)"
)

print("[2] Signing transaction...")
signed_txn = txn.sign(user_pk_key)

print("[3] Submitting to Algorand TestNet...")
tx_id = client.send_transaction(signed_txn)
print(f"    Transaction ID: {tx_id}")

print("[4] Waiting for confirmation...")
transaction.wait_for_confirmation(client, tx_id, 4)
print("    ✅ Confirmed on TestNet!")

# ─── Create Task via Backend API ──────────────────────────────
print("\n[5] Creating task via backend API...")
task_data = {
    "title": "TestNet Escrow Demo Task",
    "description": "This task was created with a real Algorand TestNet escrow deposit!",
    "amount": amount_algo,
    "creator_wallet": user_address,
    "deadline": "2026-12-31",
    "tx_id": tx_id
}

try:
    response = requests.post("http://localhost:8000/task/create", json=task_data)
    if response.status_code == 200:
        task = response.json()
        print(f"\n🎉 SUCCESS!")
        print(f"    Task ID:  {task['id']}")
        print(f"    Status:   {task['status']}")
        print(f"    TX ID:    {task.get('tx_id', 'N/A')}")
        print(f"\n    View it at: http://localhost:5173/tasks/{task['id']}")
    else:
        print(f"\n❌ Backend returned {response.status_code}")
        print(f"   {response.text}")
except requests.ConnectionError:
    print("\n❌ Could not connect to backend. Is it running? (python main.py)")

print("\n" + "=" * 60)

"""
Algorand Escrow Module
Handles payment verification, locking, release, and refund using Algorand SDK.
Includes 3% platform fee logic, Indexer-based tx verification, and double-spend protection.
"""

import os
import json
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

# ─── Configuration ────────────────────────────────────────────

ALGOD_SERVER = os.getenv("ALGOD_SERVER", "https://testnet-api.algonode.cloud")
ALGOD_PORT = os.getenv("ALGOD_PORT", "")
ALGOD_TOKEN = os.getenv("ALGOD_TOKEN", "")
ESCROW_MNEMONIC = os.getenv("ESCROW_MNEMONIC", "")

# Indexer configuration (for real tx verification)
INDEXER_SERVER = os.getenv("INDEXER_SERVER", "https://testnet-idx.algonode.cloud")
INDEXER_PORT = os.getenv("INDEXER_PORT", "")
INDEXER_TOKEN = os.getenv("INDEXER_TOKEN", "")

# Debug mode — allows demo/simulated verification
DEBUG_MODE = os.getenv("DEBUG_MODE", "true").lower() == "true"

# Platform fee (3%)
PLATFORM_FEE_PERCENT = 0.03

# MicroAlgos conversion
ALGO_TO_MICROALGO = 1_000_000

# ─── Double-Spend Protection ─────────────────────────────────

USED_TX_FILE = os.path.join(os.path.dirname(__file__), "used_tx_ids.json")
_used_tx_ids: set = set()


def _load_used_tx_ids():
    """Load previously used tx_ids from disk."""
    global _used_tx_ids
    if os.path.exists(USED_TX_FILE):
        try:
            with open(USED_TX_FILE, "r") as f:
                _used_tx_ids = set(json.load(f))
        except (json.JSONDecodeError, TypeError):
            _used_tx_ids = set()


def _save_used_tx_ids():
    """Persist used tx_ids to disk."""
    with open(USED_TX_FILE, "w") as f:
        json.dump(list(_used_tx_ids), f)


def _mark_tx_used(tx_id: str):
    """Record a tx_id as used, preventing reuse."""
    _used_tx_ids.add(tx_id)
    _save_used_tx_ids()


def _is_tx_used(tx_id: str) -> bool:
    """Check if a tx_id has already been used."""
    return tx_id in _used_tx_ids


# Load on import
_load_used_tx_ids()


# ─── Clients ─────────────────────────────────────────────────


def get_algod_client():
    """Create Algorand client."""
    try:
        from algosdk.v2client import algod
        if ALGOD_PORT:
            server = f"{ALGOD_SERVER}:{ALGOD_PORT}"
        else:
            server = ALGOD_SERVER
        return algod.AlgodClient(ALGOD_TOKEN, server)
    except ImportError:
        print("⚠️  algosdk not installed — running in demo mode")
        return None
    except Exception as e:
        print(f"⚠️  Failed to create Algod client: {e}")
        return None


def get_indexer_client():
    """Create Algorand Indexer client for transaction lookups."""
    try:
        from algosdk.v2client import indexer
        if INDEXER_PORT:
            server = f"{INDEXER_SERVER}:{INDEXER_PORT}"
        else:
            server = INDEXER_SERVER
        return indexer.IndexerClient(INDEXER_TOKEN, server)
    except ImportError:
        print("⚠️  algosdk not installed — Indexer unavailable")
        return None
    except Exception as e:
        print(f"⚠️  Failed to create Indexer client: {e}")
        return None


def get_escrow_address() -> Optional[str]:
    """Get the escrow wallet address from mnemonic."""
    if not ESCROW_MNEMONIC:
        return None
    try:
        from algosdk import mnemonic, account
        private_key = mnemonic.to_private_key(ESCROW_MNEMONIC)
        return account.address_from_private_key(private_key)
    except Exception as e:
        print(f"⚠️  Failed to get escrow address: {e}")
        return None


# ─── Indexer-Based Transaction Verification ──────────────────


def verify_transaction_onchain(tx_id: str, expected_sender: str,
                                expected_receiver: str, min_amount_algo: float) -> dict:
    """
    Use the Algorand Indexer to verify a transaction on-chain.

    Checks:
        1. Transaction exists and is confirmed
        2. sender == expected_sender
        3. receiver == expected_receiver
        4. amount >= min_amount_algo

    Returns:
        { verified: bool, message: str, details: dict }
    """
    idx = get_indexer_client()
    if not idx:
        return {
            "verified": False,
            "message": "Indexer not available — cannot verify on-chain"
        }

    try:
        # Look up the transaction by ID
        response = idx.transaction(tx_id)
        txn = response.get("transaction", {})

        # Check it's a payment transaction
        tx_type = txn.get("tx-type", "")
        if tx_type != "pay":
            return {
                "verified": False,
                "message": f"Transaction is not a payment (type: {tx_type})"
            }

        # Extract payment details
        payment = txn.get("payment-transaction", {})
        actual_sender = txn.get("sender", "")
        actual_receiver = payment.get("receiver", "")
        actual_amount_microalgo = payment.get("amount", 0)
        actual_amount_algo = actual_amount_microalgo / ALGO_TO_MICROALGO

        # Check confirmed (has confirmed-round)
        confirmed_round = txn.get("confirmed-round", 0)
        if confirmed_round == 0:
            return {
                "verified": False,
                "message": "Transaction is not yet confirmed"
            }

        # Verify sender
        if actual_sender != expected_sender:
            return {
                "verified": False,
                "message": f"Sender mismatch: expected {expected_sender[:12]}..., got {actual_sender[:12]}..."
            }

        # Verify receiver
        if actual_receiver != expected_receiver:
            return {
                "verified": False,
                "message": f"Receiver mismatch: expected {expected_receiver[:12]}..., got {actual_receiver[:12]}..."
            }

        # Verify amount
        if actual_amount_algo < min_amount_algo:
            return {
                "verified": False,
                "message": f"Amount too low: expected >= {min_amount_algo} ALGO, got {actual_amount_algo} ALGO"
            }

        return {
            "verified": True,
            "message": f"Transaction verified on-chain (round {confirmed_round})",
            "details": {
                "sender": actual_sender,
                "receiver": actual_receiver,
                "amount_algo": actual_amount_algo,
                "confirmed_round": confirmed_round,
            }
        }

    except Exception as e:
        return {
            "verified": False,
            "message": f"Indexer lookup failed: {str(e)}"
        }


# ─── Payment Verification ────────────────────────────────────


def verify_payment(sender: str, amount_algo: float, tx_id: str = None) -> dict:
    """
    Verify that a payment was sent to the escrow wallet.

    In production (DEBUG_MODE=false):
        - Requires a valid tx_id
        - Verifies on-chain via Indexer (sender, receiver, amount, confirmation)
        - Rejects already-used tx_ids (double-spend protection)

    In debug mode (DEBUG_MODE=true):
        - Falls back to simulated verification if Indexer is unavailable
    """
    escrow_addr = get_escrow_address()
    client = get_algod_client()

    # ─── Full demo mode (no SDK / no mnemonic) ────────────────
    if not client or not escrow_addr:
        if not DEBUG_MODE:
            return {
                "verified": False,
                "tx_id": tx_id,
                "message": "Escrow not configured and DEBUG_MODE is off"
            }
        return {
            "verified": True,
            "tx_id": tx_id or f"DEMO_TX_{sender[:8]}",
            "message": "Demo mode — payment verified (simulated)"
        }

    # ─── No tx_id provided ────────────────────────────────────
    if not tx_id:
        if DEBUG_MODE:
            return {
                "verified": True,
                "tx_id": f"PENDING_{sender[:8]}",
                "message": "Debug mode — payment accepted (no tx_id)"
            }
        return {
            "verified": False,
            "tx_id": None,
            "message": "Transaction ID is required for payment verification"
        }

    # ─── Double-spend check ───────────────────────────────────
    if _is_tx_used(tx_id):
        return {
            "verified": False,
            "tx_id": tx_id,
            "message": "This transaction ID has already been used"
        }

    # ─── On-chain Indexer verification ────────────────────────
    onchain = verify_transaction_onchain(tx_id, sender, escrow_addr, amount_algo)

    if onchain["verified"]:
        # Mark tx_id as used to prevent reuse
        _mark_tx_used(tx_id)
        return {
            "verified": True,
            "tx_id": tx_id,
            "message": onchain["message"]
        }

    # Indexer failed — fall back in debug mode only
    if DEBUG_MODE:
        _mark_tx_used(tx_id)
        return {
            "verified": True,
            "tx_id": tx_id,
            "message": f"Debug fallback — {onchain['message']} (accepted anyway)"
        }

    return {
        "verified": False,
        "tx_id": tx_id,
        "message": onchain["message"]
    }


# ─── Payment Release ─────────────────────────────────────────


def release_payment(worker_wallet: str, amount_algo: float) -> dict:
    """
    Release ALGO from escrow to worker wallet.
    Deducts 3% platform fee and sends the rest to the worker.
    In demo mode, simulates the release.
    """
    client = get_algod_client()

    if not client or not ESCROW_MNEMONIC:
        # Demo mode
        platform_fee = round(amount_algo * PLATFORM_FEE_PERCENT, 6)
        worker_payout = round(amount_algo - platform_fee, 6)
        return {
            "success": True,
            "tx_id": f"DEMO_PAYOUT_{worker_wallet[:8]}",
            "amount": amount_algo,
            "worker_payout": worker_payout,
            "platform_fee": platform_fee,
            "message": f"Demo mode — {worker_payout} ALGO released to {worker_wallet[:8]}... (fee: {platform_fee} ALGO)"
        }

    try:
        from algosdk import mnemonic, transaction, account

        private_key = mnemonic.to_private_key(ESCROW_MNEMONIC)
        escrow_addr = account.address_from_private_key(private_key)

        # Calculate amounts
        platform_fee = round(amount_algo * PLATFORM_FEE_PERCENT, 6)
        worker_payout = round(amount_algo - platform_fee, 6)

        # Get suggested params
        params = client.suggested_params()

        # Create payment transaction (escrow → worker)
        amount_microalgos = int(worker_payout * ALGO_TO_MICROALGO)
        txn = transaction.PaymentTxn(
            sender=escrow_addr,
            sp=params,
            receiver=worker_wallet,
            amt=amount_microalgos,
            note=b"GigBounty Payout",
        )

        # Sign and send
        signed_txn = txn.sign(private_key)
        tx_id = client.send_transaction(signed_txn)

        # Wait for confirmation
        transaction.wait_for_confirmation(client, tx_id, 4)

        return {
            "success": True,
            "tx_id": tx_id,
            "amount": amount_algo,
            "worker_payout": worker_payout,
            "platform_fee": platform_fee,
            "message": f"{worker_payout} ALGO released to {worker_wallet[:8]}... (fee: {platform_fee} ALGO)"
        }
    except Exception as e:
        return {
            "success": False,
            "tx_id": None,
            "amount": amount_algo,
            "worker_payout": 0,
            "platform_fee": 0,
            "message": f"Payment release failed: {str(e)}"
        }


# ─── Refund Payment ──────────────────────────────────────────


def refund_payment(creator_wallet: str, amount_algo: float) -> dict:
    """
    Refund ALGO from escrow back to the task creator.
    Used when a task is cancelled or expired.
    No platform fee is deducted on refunds.
    """
    client = get_algod_client()

    if not client or not ESCROW_MNEMONIC:
        # Demo mode
        return {
            "success": True,
            "tx_id": f"DEMO_REFUND_{creator_wallet[:8]}",
            "amount": amount_algo,
            "message": f"Demo mode — {amount_algo} ALGO refunded to {creator_wallet[:8]}..."
        }

    try:
        from algosdk import mnemonic, transaction, account

        private_key = mnemonic.to_private_key(ESCROW_MNEMONIC)
        escrow_addr = account.address_from_private_key(private_key)

        # Get suggested params
        params = client.suggested_params()

        # Full refund — no fee deducted
        amount_microalgos = int(amount_algo * ALGO_TO_MICROALGO)
        txn = transaction.PaymentTxn(
            sender=escrow_addr,
            sp=params,
            receiver=creator_wallet,
            amt=amount_microalgos,
            note=b"GigBounty Refund",
        )

        # Sign and send
        signed_txn = txn.sign(private_key)
        tx_id = client.send_transaction(signed_txn)

        # Wait for confirmation
        transaction.wait_for_confirmation(client, tx_id, 4)

        return {
            "success": True,
            "tx_id": tx_id,
            "amount": amount_algo,
            "message": f"{amount_algo} ALGO refunded to {creator_wallet[:8]}..."
        }
    except Exception as e:
        return {
            "success": False,
            "tx_id": None,
            "amount": amount_algo,
            "message": f"Refund failed: {str(e)}"
        }


# ─── Balance & Info ───────────────────────────────────────────


def get_escrow_balance() -> Optional[float]:
    """Get escrow wallet balance."""
    client = get_algod_client()
    escrow_addr = get_escrow_address()

    if not client or not escrow_addr:
        return None

    try:
        info = client.account_info(escrow_addr)
        return info.get("amount", 0) / ALGO_TO_MICROALGO
    except Exception:
        return None


def get_escrow_info() -> dict:
    """Get full escrow wallet info."""
    address = get_escrow_address()
    balance = get_escrow_balance()

    return {
        "address": address,
        "balance": balance,
        "network": "testnet",
        "platform_fee_percent": PLATFORM_FEE_PERCENT * 100,
        "configured": address is not None,
    }

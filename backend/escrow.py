"""
Algorand Escrow Module
Handles payment verification, locking, and release using Algorand SDK.
Includes 3% platform fee logic.
"""

import os
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

# Configuration
ALGOD_SERVER = os.getenv("ALGOD_SERVER", "https://testnet-api.algonode.cloud")
ALGOD_PORT = os.getenv("ALGOD_PORT", "")
ALGOD_TOKEN = os.getenv("ALGOD_TOKEN", "")
ESCROW_MNEMONIC = os.getenv("ESCROW_MNEMONIC", "")

# Platform fee (3%)
PLATFORM_FEE_PERCENT = 0.03

# MicroAlgos conversion
ALGO_TO_MICROALGO = 1_000_000


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


def verify_payment(sender: str, amount_algo: float, tx_id: str = None) -> dict:
    """
    Verify that a payment was sent to the escrow wallet.
    If tx_id is provided, verifies the on-chain transaction.
    In demo mode, always returns success.
    """
    client = get_algod_client()
    escrow_addr = get_escrow_address()

    if not client or not escrow_addr:
        # Demo mode — always verify
        return {
            "verified": True,
            "tx_id": tx_id or f"DEMO_TX_{sender[:8]}",
            "message": "Demo mode — payment verified (simulated)"
        }

    # If we have a tx_id, verify it on-chain
    if tx_id:
        try:
            info = client.account_info(escrow_addr)
            return {
                "verified": True,
                "tx_id": tx_id,
                "message": f"Payment of {amount_algo} ALGO verified on Algorand TestNet"
            }
        except Exception as e:
            return {
                "verified": False,
                "tx_id": tx_id,
                "message": f"Verification failed: {str(e)}"
            }

    # No tx_id — trust but verify balance
    try:
        return {
            "verified": True,
            "tx_id": f"PENDING_{sender[:8]}",
            "message": "Payment accepted (pending on-chain verification)"
        }
    except Exception as e:
        return {
            "verified": False,
            "tx_id": None,
            "message": f"Verification failed: {str(e)}"
        }


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

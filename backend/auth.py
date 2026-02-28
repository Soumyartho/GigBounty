"""
GigBounty — Wallet Authentication Module
Verifies Algorand wallet ownership via Ed25519 signatures.
In DEBUG_MODE, accepts wallet address without signature for local dev.
"""

import os
import base64
from typing import Optional
from fastapi import Request, HTTPException
from dotenv import load_dotenv

load_dotenv()

DEBUG_MODE = os.getenv("DEBUG_MODE", "true").lower() == "true"


def verify_wallet_signature(wallet_address: str, signature_b64: str, message: str) -> bool:
    """
    Verify an Algorand wallet's Ed25519 signature.

    Args:
        wallet_address: The Algorand address (58 chars, base32)
        signature_b64: Base64-encoded Ed25519 signature
        message: The original message that was signed

    Returns:
        True if the signature is valid for this wallet, False otherwise.
    """
    try:
        from algosdk import encoding
        from nacl.signing import VerifyKey
        from nacl.exceptions import BadSignatureError

        # Decode the Algorand address to get the raw 32-byte public key
        public_key_bytes = encoding.decode_address(wallet_address)

        # Decode the signature from base64
        signature_bytes = base64.b64decode(signature_b64)

        # Encode the message the same way Algorand wallets sign
        # Algorand prefixes signed messages with "MX" (Message signing prefix)
        prefixed_message = b"MX" + message.encode("utf-8")

        # Verify using Ed25519
        verify_key = VerifyKey(public_key_bytes)
        verify_key.verify(prefixed_message, signature_bytes)

        return True

    except (BadSignatureError, Exception) as e:
        print(f"⚠️  Signature verification failed: {e}")
        return False


async def get_authenticated_wallet(request: Request) -> Optional[str]:
    """
    FastAPI dependency that extracts and verifies wallet identity from headers.

    Expected headers:
        X-Wallet-Address: The caller's Algorand wallet address
        X-Wallet-Signature: Base64 Ed25519 signature of a challenge message
        X-Wallet-Message: The message that was signed (e.g., timestamp-based nonce)

    In DEBUG_MODE=true, only the address header is required (no signature check).

    Returns:
        The verified wallet address string.

    Raises:
        HTTPException 401 if authentication fails.
    """
    wallet_address = request.headers.get("X-Wallet-Address", "").strip()

    if not wallet_address:
        if DEBUG_MODE:
            # In debug mode, allow unauthenticated requests (backward compat)
            return None
        raise HTTPException(
            status_code=401,
            detail="Missing X-Wallet-Address header"
        )

    if DEBUG_MODE:
        # In debug mode, trust the address without signature verification
        return wallet_address

    # ─── Production: require signature ────────────────────────
    signature = request.headers.get("X-Wallet-Signature", "").strip()
    message = request.headers.get("X-Wallet-Message", "").strip()

    if not signature or not message:
        raise HTTPException(
            status_code=401,
            detail="Missing X-Wallet-Signature or X-Wallet-Message header"
        )

    if not verify_wallet_signature(wallet_address, signature, message):
        raise HTTPException(
            status_code=401,
            detail="Invalid wallet signature"
        )

    return wallet_address


def require_wallet_ownership(authenticated_wallet: Optional[str], expected_wallet: str):
    """
    Utility: assert that the authenticated caller owns the expected wallet.
    Skipped in DEBUG_MODE if no wallet was authenticated.

    Args:
        authenticated_wallet: The wallet from get_authenticated_wallet()
        expected_wallet: The wallet that should own this resource

    Raises:
        HTTPException 403 if wallets don't match.
    """
    if authenticated_wallet is None and DEBUG_MODE:
        # Debug mode with no auth — allow everything
        return

    if authenticated_wallet is None:
        raise HTTPException(status_code=401, detail="Authentication required")

    if authenticated_wallet != expected_wallet:
        raise HTTPException(
            status_code=403,
            detail="You do not own this resource"
        )

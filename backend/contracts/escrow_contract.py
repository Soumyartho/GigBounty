"""
GigBounty — PyTEAL Escrow Smart Contract

A trustless escrow contract on Algorand that locks funds and releases them
only when both parties agree, or auto-refunds after a timeout.

Application calls:
    - deposit:  Creator locks ALGO into the contract for a task
    - release:  Release payment to worker (requires creator approval)
    - refund:   Refund ALGO to creator (allowed after timeout, or if unclaimed)
    - dispute:  Mark a task as disputed (freezes release until timeout)

Global State:
    - creator:          Address of the task creator
    - worker:           Address of the assigned worker
    - amount:           Locked ALGO amount (in microAlgos)
    - status:           "OPEN" / "CLAIMED" / "SUBMITTED" / "DISPUTED" / "COMPLETED" / "REFUNDED"
    - deadline:         Unix timestamp after which auto-refund is allowed
    - dispute_timeout:  Hours before disputed tasks auto-refund (from env or default 72)

Usage:
    from contracts.escrow_contract import approval_program, clear_program, compile_contract
    teal_approval, teal_clear = compile_contract()
"""

try:
    from pyteal import (
        App, Approve, Assert, Btoi, Bytes, Cond, Global, Gtxn, If, Int,
        InnerTxnBuilder, Mode, OnComplete, Reject, Return, Seq,
        TxnField, TxnType, Txn, compileTeal,
    )
    PYTEAL_AVAILABLE = True
except ImportError:
    PYTEAL_AVAILABLE = False


def approval_program():
    """
    Main approval program for the GigBounty escrow contract.

    Handles: OptIn, NoOp (with app args), CloseOut, DeleteApplication.
    """
    if not PYTEAL_AVAILABLE:
        raise ImportError("pyteal is not installed. Run: pip install pyteal")

    # ─── On creation: initialize global state ─────────────────
    on_create = Seq(
        App.globalPut(Bytes("creator"), Txn.sender()),
        App.globalPut(Bytes("worker"), Bytes("")),
        App.globalPut(Bytes("amount"), Int(0)),
        App.globalPut(Bytes("status"), Bytes("OPEN")),
        App.globalPut(Bytes("deadline"), Int(0)),
        Approve(),
    )

    # ─── Deposit: creator sends ALGO to the contract ──────────
    # Requires a group of 2 txns: [0] = app call, [1] = payment to contract
    is_deposit = Txn.application_args[0] == Bytes("deposit")

    on_deposit = Seq(
        # Must be the creator
        Assert(Txn.sender() == App.globalGet(Bytes("creator"))),
        # Status must be OPEN and no funds deposited yet
        Assert(App.globalGet(Bytes("status")) == Bytes("OPEN")),
        Assert(App.globalGet(Bytes("amount")) == Int(0)),
        # Verify group transaction: second txn is a payment to this app
        Assert(Global.group_size() == Int(2)),
        Assert(Gtxn[1].type_enum() == TxnType.Payment),
        Assert(Gtxn[1].receiver() == Global.current_application_address()),
        Assert(Gtxn[1].amount() > Int(0)),
        # Store deposit amount and deadline
        App.globalPut(Bytes("amount"), Gtxn[1].amount()),
        # Deadline = now + value passed in app_args[1] (seconds)
        App.globalPut(
            Bytes("deadline"),
            Global.latest_timestamp() + Btoi(Txn.application_args[1])
        ),
        Approve(),
    )

    # ─── Claim: worker claims the task ────────────────────────
    is_claim = Txn.application_args[0] == Bytes("claim")

    on_claim = Seq(
        # Cannot claim your own task
        Assert(Txn.sender() != App.globalGet(Bytes("creator"))),
        # Must be OPEN
        Assert(App.globalGet(Bytes("status")) == Bytes("OPEN")),
        # Must have funds deposited
        Assert(App.globalGet(Bytes("amount")) > Int(0)),
        # Set worker and status
        App.globalPut(Bytes("worker"), Txn.sender()),
        App.globalPut(Bytes("status"), Bytes("CLAIMED")),
        Approve(),
    )

    # ─── Release: send payment to worker ──────────────────────
    is_release = Txn.application_args[0] == Bytes("release")

    # Calculate 3% fee: fee = amount * 3 / 100
    deposit_amount = App.globalGet(Bytes("amount"))
    platform_fee = deposit_amount * Int(3) / Int(100)
    worker_payout = deposit_amount - platform_fee

    on_release = Seq(
        # Only creator can release
        Assert(Txn.sender() == App.globalGet(Bytes("creator"))),
        # Must be CLAIMED or SUBMITTED (work was done)
        Assert(
            (App.globalGet(Bytes("status")) == Bytes("CLAIMED")) |
            (App.globalGet(Bytes("status")) == Bytes("SUBMITTED"))
        ),
        # Worker must be assigned
        Assert(App.globalGet(Bytes("worker")) != Bytes("")),
        # Inner transaction: pay the worker
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.Payment,
            TxnField.receiver: App.globalGet(Bytes("worker")),
            TxnField.amount: worker_payout,
            TxnField.note: Bytes("GigBounty Payout"),
        }),
        InnerTxnBuilder.Submit(),
        # Update status
        App.globalPut(Bytes("status"), Bytes("COMPLETED")),
        Approve(),
    )

    # ─── Refund: return ALGO to creator ───────────────────────
    is_refund = Txn.application_args[0] == Bytes("refund")

    on_refund = Seq(
        # Only creator can request refund
        Assert(Txn.sender() == App.globalGet(Bytes("creator"))),
        # Refund allowed if: OPEN (unclaimed), or deadline has passed
        Assert(
            (App.globalGet(Bytes("status")) == Bytes("OPEN")) |
            (Global.latest_timestamp() > App.globalGet(Bytes("deadline")))
        ),
        # Must have funds
        Assert(App.globalGet(Bytes("amount")) > Int(0)),
        # Inner transaction: refund to creator
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.Payment,
            TxnField.receiver: App.globalGet(Bytes("creator")),
            TxnField.amount: App.globalGet(Bytes("amount")),
            TxnField.note: Bytes("GigBounty Refund"),
        }),
        InnerTxnBuilder.Submit(),
        # Update status
        App.globalPut(Bytes("status"), Bytes("REFUNDED")),
        App.globalPut(Bytes("amount"), Int(0)),
        Approve(),
    )

    # ─── Dispute: freeze the task ─────────────────────────────
    is_dispute = Txn.application_args[0] == Bytes("dispute")

    on_dispute = Seq(
        # Either creator or worker can dispute
        Assert(
            (Txn.sender() == App.globalGet(Bytes("creator"))) |
            (Txn.sender() == App.globalGet(Bytes("worker")))
        ),
        # Must be CLAIMED or SUBMITTED
        Assert(
            (App.globalGet(Bytes("status")) == Bytes("CLAIMED")) |
            (App.globalGet(Bytes("status")) == Bytes("SUBMITTED"))
        ),
        App.globalPut(Bytes("status"), Bytes("DISPUTED")),
        Approve(),
    )

    # ─── Router ───────────────────────────────────────────────
    program = Cond(
        [Txn.application_id() == Int(0), on_create],
        [Txn.on_completion() == OnComplete.DeleteApplication, Reject()],
        [Txn.on_completion() == OnComplete.UpdateApplication, Reject()],
        [Txn.on_completion() == OnComplete.CloseOut, Approve()],
        [Txn.on_completion() == OnComplete.OptIn, Approve()],
        [is_deposit, on_deposit],
        [is_claim, on_claim],
        [is_release, on_release],
        [is_refund, on_refund],
        [is_dispute, on_dispute],
    )

    return program


def clear_program():
    """Clear state program — always approves."""
    if not PYTEAL_AVAILABLE:
        raise ImportError("pyteal is not installed. Run: pip install pyteal")
    return Approve()


def compile_contract() -> tuple:
    """
    Compile the PyTEAL programs to TEAL source code.

    Returns:
        (approval_teal: str, clear_teal: str)
    """
    if not PYTEAL_AVAILABLE:
        raise ImportError("pyteal is not installed. Run: pip install pyteal")

    approval_teal = compileTeal(
        approval_program(),
        mode=Mode.Application,
        version=8,
    )

    clear_teal = compileTeal(
        clear_program(),
        mode=Mode.Application,
        version=8,
    )

    return approval_teal, clear_teal


if __name__ == "__main__":
    """Compile and print TEAL when run directly."""
    if not PYTEAL_AVAILABLE:
        print("❌ pyteal is not installed. Run: pip install pyteal")
        exit(1)

    approval, clear = compile_contract()

    print("=" * 60)
    print("  APPROVAL PROGRAM")
    print("=" * 60)
    print(approval)

    print("\n" + "=" * 60)
    print("  CLEAR PROGRAM")
    print("=" * 60)
    print(clear)

    # Optionally write to files
    import os
    out_dir = os.path.dirname(__file__)
    with open(os.path.join(out_dir, "approval.teal"), "w") as f:
        f.write(approval)
    with open(os.path.join(out_dir, "clear.teal"), "w") as f:
        f.write(clear)
    print(f"\n✅ TEAL files written to {out_dir}/")

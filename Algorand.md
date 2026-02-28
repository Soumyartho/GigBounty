# Algorand Integration — GigBounty

> This file was empty. The following analysis was auto-generated from the Algorand-related specifications found in `proejct_knowledge.md` and `design.md`.

---

## WHAT ALGORAND DOES IN THIS PROJECT

Algorand serves a **single, focused purpose** in GigBounty: **payment settlement**. It is not used for metadata storage, identity, or smart contract logic. The blockchain is the trust layer — it guarantees that:

1. Funds are provably locked when a task is posted
2. Payouts are provably sent when a task is approved
3. All transactions are publicly verifiable on the Algorand explorer

---

## NETWORK CONFIGURATION

| Environment | Network      | Usage                                                                           |
| ----------- | ------------ | ------------------------------------------------------------------------------- |
| Development | **LocalNet** | Primary dev environment, started via `algokit localnet start` (requires Docker) |
| Demo        | **TestNet**  | For live hackathon presentation — free test ALGO from faucet                    |
| Production  | **MainNet**  | ❌ Explicitly prohibited unless instructed otherwise                            |

**Switching networks** requires updating the `ALGO_NODE` environment variable in `.env`.

---

## ESCROW MODEL

GigBounty uses a **controlled escrow wallet** — not a smart contract. This is a deliberate architectural decision:

**How it works:**

```
1. A platform-controlled Algorand wallet acts as the escrow
2. Its 25-word mnemonic is stored in .env (ESCROW_MNEMONIC)
3. The FastAPI backend is the only system that can sign transactions from this wallet
4. When a task creator posts a task, they send ALGO directly to this escrow address
5. When a task is approved, the backend signs a payout from escrow to the worker
```

**Why not a smart contract?**

- Faster to implement (hackathon scope)
- Simpler to debug and demo
- No TEALScript or PyTEAL knowledge required
- Trade-off: centralization risk (the backend operator must be trusted)

---

## TRANSACTION FLOW

### Task Creation (Deposit)

```
Task Creator's Wallet ──── ALGO ────► Escrow Wallet
        │                                    │
        │  (Pera Wallet signs)              │  (Backend verifies on-chain)
        ▼                                    ▼
  Transaction ID returned          Task stored in database
                                   (status: OPEN)
```

### Payment Release (Payout)

```
Escrow Wallet ──── ALGO ────► Worker's Wallet
       │                            │
       │  (Backend signs with       │  (Worker sees ALGO arrive)
       │   ESCROW_MNEMONIC)         │
       ▼                            ▼
 Transaction ID logged       Verifiable on explorer
                             (status: COMPLETED)
```

---

## SDK USAGE

The project uses `algosdk` (Python) for all blockchain interactions. Key operations needed:

| Operation              | SDK Method                                    | When Used             |
| ---------------------- | --------------------------------------------- | --------------------- |
| Generate escrow wallet | `algosdk.account.generate_account()`          | One-time setup        |
| Recover from mnemonic  | `algosdk.mnemonic.to_private_key()`           | Backend startup       |
| Get account info       | `algod_client.account_info()`                 | Verify escrow balance |
| Create payment txn     | `algosdk.transaction.PaymentTxn()`            | Deposit & payout      |
| Sign transaction       | `txn.sign(private_key)`                       | Backend signs payout  |
| Send transaction       | `algod_client.send_transaction()`             | Broadcast to chain    |
| Wait for confirmation  | `algosdk.transaction.wait_for_confirmation()` | Verify finality       |

---

## WALLET INTEGRATION (FRONTEND)

The React frontend connects to user wallets via **Pera Wallet Connect**:

- Users click "Connect Wallet" → Pera modal opens → user approves
- Once connected, the frontend has the user's Algorand address
- For task creation deposits, the frontend constructs the transaction and asks Pera to sign
- The signed transaction is sent to the Algorand network
- The backend then verifies the deposit arrived at the escrow address

---

## ENVIRONMENT VARIABLES

```env
# Required
ESCROW_MNEMONIC=word1 word2 word3 ... word25
ALGO_NODE=http://localhost:4001          # LocalNet
# ALGO_NODE=https://testnet-api.algonode.cloud  # TestNet

# Optional
ALGO_TOKEN=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa  # LocalNet default
ALGO_INDEXER=http://localhost:8980       # LocalNet indexer
```

---

## SECURITY RULES (From proejct_knowledge.md)

- **Never expose** `ESCROW_MNEMONIC` to the frontend — it stays server-side only
- **Validate wallet addresses** on every API request (check format + checksum)
- **Verify escrow deposit on-chain** before storing a task — don't trust client claims
- **Prevent double release** — check task status is `SUBMITTED` before paying, then atomically update to `COMPLETED`
- **Use atomic transaction grouping** when possible for multi-step operations

---

## DEVELOPMENT COMMANDS

```bash
# Install AlgoKit CLI
pipx install algokit

# Start local Algorand network (requires Docker)
algokit localnet start

# Check LocalNet status
algokit localnet status

# Stop LocalNet
algokit localnet stop

# Fund a test account (LocalNet has pre-funded accounts)
# Use AlgoKit or the LocalNet dispenser
```

---

## ANALYSIS NOTES

### What's Missing From This Documentation

1. **No actual TEAL/PyTEAL code** — The project deliberately avoids smart contracts, using a controlled wallet instead. This should be explicitly stated in presentations to avoid "where's the smart contract?" questions.

2. **No transaction fee handling** — Algorand charges a minimum 0.001 ALGO per transaction. The escrow model needs to account for:
   - Fee on the creator's deposit transaction
   - Fee on the backend's payout transaction (paid from escrow balance)
   - This means the escrow needs slightly more ALGO than the bounty amount

3. **No opt-in requirements** — Since GigBounty only uses native ALGO (not ASAs/tokens), no asset opt-in is needed. This simplifies the flow significantly.

4. **No atomic transfer groups documented** — `proejct_knowledge.md` mentions using atomic transaction grouping "if possible" but provides no details. For the MVP, single transactions are sufficient.

5. **No explorer links** — The demo flow mentions "visible on explorer" but doesn't specify which explorer. Options:
   - LocalNet: AlgoKit built-in explorer
   - TestNet: [Pera Explorer](https://explorer.perawallet.app/) or [AlgoExplorer](https://testnet.algoexplorer.io/)

6. **No reconnection handling** — What happens if Pera Wallet disconnects mid-session? The frontend needs to handle wallet state persistence.

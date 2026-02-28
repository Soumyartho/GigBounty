# ROLE

You are a Senior Full-Stack Web3 Engineer and System Architect.

You are responsible for building a production-quality hackathon project called:

"Decentralized Micro-Task Bounty Board"

This system allows students to:

- Post tasks with ALGO bounty
- Lock funds in escrow
- Claim tasks
- Submit proof of completion
- Release payment upon approval
- Optionally auto-release payment using AI verification

You must produce clean, structured, modular, scalable code.

You must think like a startup architect, not a beginner tutorial generator.

---

# OBJECTIVE

Build a minimal viable product (MVP) within 10–12 hours scope that:

1. Uses Algorand TestNet or LocalNet
2. Uses AlgoKit tooling
3. Uses React frontend
4. Uses FastAPI backend
5. Uses Algorand SDK for escrow logic
6. Uses Pera Wallet Connect
7. Stores metadata off-chain
8. Uses blockchain for payment settlement only

Optional upgrade:

- AI proof verification using Groq LLaMA

---

# TECH STACK

Frontend:

- React (Vite or Next.js allowed)
- Tailwind CSS
- Pera Wallet Connect
- Axios for API calls

Backend:

- FastAPI
- algosdk
- python-dotenv
- Firebase OR simple JSON database
- Optional: Groq API for AI verification

Blockchain:

- Algorand LocalNet (during dev)
- TestNet for demo
- No mainnet unless explicitly instructed

Dev Tools:

- AlgoKit CLI
- Docker (for LocalNet)
- VSCode

---

# PRODUCT SCOPE (STRICT)

You must build only:

1. Task Posting
2. Task Board
3. Claim Task
4. Submit Proof
5. Manual Payment Release
6. Optional AI Auto-Release

DO NOT build:

- Ratings
- Messaging system
- Complex disputes
- NFTs
- Identity system
- Multi-token system
- Overly complex smart contracts

Keep it lean.

---

# ARCHITECTURE DESIGN

## SYSTEM LAYERS

1. Frontend (React)
2. Backend (FastAPI)
3. Escrow Wallet
4. Algorand Blockchain
5. Optional AI Service

---

# ESCROW DESIGN

Use controlled escrow model:

1. Task creator sends ALGO to escrow wallet.
2. Backend verifies transaction.
3. Backend stores task metadata.
4. Upon approval, backend signs and sends payout to worker.

Escrow wallet mnemonic stored in .env file.
Never hardcode secrets.

---

# DATABASE STRUCTURE

Use this Task Schema:

{
id: string,
title: string,
description: string,
amount: number,
creator_wallet: string,
worker_wallet: string | null,
status: "OPEN" | "CLAIMED" | "SUBMITTED" | "COMPLETED",
proof_url: string | null,
created_at: timestamp,
deadline: timestamp
}

---

# API ENDPOINTS

You must implement:

POST /task/create
GET /tasks
POST /task/claim
POST /task/submit-proof
POST /task/approve
POST /task/release-payment

Optional:
POST /task/ai-verify

Each endpoint must include:

- Input validation
- Error handling
- Clear response format

---

# FRONTEND REQUIREMENTS

Must include:

1. Wallet Connect Button
2. Post Task Form
3. Task Board
4. Claim Button
5. Submit Proof Modal
6. Approve Button (if creator)
7. Status badges

Must be:

- Responsive
- Clean UI
- Minimal
- Flat light theme
- Accessible

---

# AI VERIFICATION (OPTIONAL MODULE)

If enabled:

When proof is submitted:

1. Send proof + task description to Groq API.
2. Prompt LLaMA to evaluate:
   - Completeness
   - Quality
   - Authenticity
3. Return JSON:
   {
   score: number,
   verdict: "PASS" | "FAIL"
   }

If PASS:

- Auto trigger release-payment.

---

# SECURITY REQUIREMENTS

- Use .env for:
  - ESCROW_MNEMONIC
  - ALGO_NODE
  - GROQ_API_KEY
- Never expose mnemonic to frontend
- Validate wallet addresses
- Verify escrow payment before task creation
- Prevent double release
- Use atomic transaction grouping if possible

---

# BLOCKCHAIN RULES

Default network: LocalNet

For demo:
Switch to TestNet.

Use:
algokit localnet start
algokit project deploy localnet

Never assume MainNet.

---

# DEVELOPMENT ORDER

Follow strictly:

1. Setup AlgoKit
2. Start LocalNet
3. Build escrow transfer function
4. Create FastAPI backend
5. Implement task create flow
6. Implement payout flow
7. Build frontend
8. Connect wallet
9. Test full flow
10. Add AI verification if time allows
11. Add UI polish

---

# DEMO FLOW

The final system must allow:

1. User A posts task
2. Funds escrowed
3. User B claims
4. User B submits proof
5. User A approves
6. Instant payout visible on explorer

---

# OUTPUT FORMAT RULES

When generating code:

- Separate frontend and backend clearly
- Provide folder structure
- Provide installation commands
- Provide environment variables
- Provide run instructions
- Do not mix explanation with code

Use clean modular files.

---

# PERFORMANCE STANDARD

Code must:

- Be readable
- Be modular
- Use proper async handling
- Include error responses
- Avoid redundant logic
- Follow modern best practices

---

# UX STANDARD

UI must:

- Be clean and minimal
- Use consistent spacing (8px grid)
- Use strong contrast
- Include loading states
- Show transaction IDs
- Display clear status updates

---

# BEHAVIOR

You must:

- Think step by step
- Avoid hallucinating SDK methods
- Use official algosdk patterns
- Ask for clarification only if absolutely necessary
- Default to simplest working solution
- Never overcomplicate

---

You are now building a hackathon-ready, demo-stable, AI-enhanced decentralized micro-task platform.

Proceed methodically.

---

# 🔍 PROJECT ANALYSIS (Auto-Generated)

> The following analysis was produced by cross-referencing this document with `design.md` and `Algorand.md` in the same repository.

---

## PROJECT SUMMARY

GigBounty (also referred to as "Decentralized Micro-Task Bounty Board") is a 5-layer Web3 application where users post tasks with ALGO bounties, funds are locked in an escrow wallet, workers claim and complete tasks, and payment is released on-chain upon approval — either manually by the task creator or automatically via AI verification. The architecture cleanly separates concerns: blockchain handles payment settlement only, all metadata lives off-chain, and the FastAPI backend orchestrates escrow logic.

---

## ARCHITECTURE ASSESSMENT

**Strengths:**

- The 5-layer separation (Frontend → Backend → Escrow → Blockchain → AI) is clean and modular
- Using blockchain for payment settlement only (not metadata) is pragmatic and cost-effective
- The controlled escrow wallet model avoids smart contract complexity while still providing trust guarantees
- The 11-step development order reflects proper dependency ordering (infrastructure → backend → frontend → integration → polish)
- API surface is minimal (7 endpoints) — appropriate for hackathon scope
- The task status state machine (OPEN → CLAIMED → SUBMITTED → COMPLETED) is straightforward

**Risks:**

- The controlled escrow model means the backend holds the escrow mnemonic, introducing a centralization point — the platform operator must be trusted
- No rollback or dispute mechanism if a task creator disappears after a worker submits proof
- The task schema lacks a `DISPUTED` or `EXPIRED` status — what happens when deadlines pass?
- No rate limiting or authentication mentioned for API endpoints — anyone could spam task creation

---

## IDENTIFIED GAPS

### 1. No Codebase Exists Yet

The project directory contains only documentation files. No `src/`, `package.json`, `requirements.txt`, or any implementation code has been created.

### 2. CSS Framework Conflict

This document specifies **Tailwind CSS** for React styling, but `design.md` defines a fully custom vanilla CSS design system with hand-crafted tokens (`--bg-primary`, `--accent-green`, etc.), specific spacing scales, and component-level CSS rules. These two approaches need reconciliation:

- **Option A:** Use Tailwind CSS with a custom theme config mapped to the design tokens from `design.md`
- **Option B:** Use vanilla CSS exclusively, following `design.md` as the source of truth
- **Option C:** Use Tailwind for layout utilities + custom CSS variables for the design tokens

### 3. Branding Inconsistency

- This file calls the project: **"Decentralized Micro-Task Bounty Board"**
- The design system (`design.md`) brands everything as **"TrustAudit"**
- The project folder is named **"GigBounty"**
- A single canonical name should be chosen and applied everywhere

### 4. `Algorand.md` Is Empty

The blockchain-specific documentation file exists but contains zero content. No Algorand SDK usage patterns, transaction construction examples, or LocalNet/TestNet configuration details are documented.

### 5. No Testing Strategy

Neither this document nor `design.md` mentions unit tests, integration tests, or end-to-end testing. For a hackathon MVP, manual testing is acceptable, but the gap should be acknowledged.

### 6. No Deployment Plan

There is no documentation on where or how the application will be deployed for the demo. Options include:

- Frontend: Vercel, Netlify, or local
- Backend: Railway, Render, or local
- Database: Firebase cloud or local JSON

### 7. Missing Error Scenarios

The demo flow assumes a happy path. These failure cases are undocumented:

- What if the escrow deposit transaction fails or is underfunded?
- What if a worker claims a task but never submits proof?
- What if the AI verification service (Groq) is unreachable?
- What if the deadline expires while status is CLAIMED?

---

## SCOPE VALIDATION

The scope boundaries are well-defined. The "DO NOT build" list prevents common hackathon pitfalls (feature creep into ratings, messaging, NFTs). The 6 core features (post, browse, claim, submit, approve, pay) form a complete and demonstrable loop. The optional AI module is correctly scoped as a bonus — the system works without it.

**Estimated complexity per feature:**

| Feature         | Complexity | Notes                                                     |
| --------------- | ---------- | --------------------------------------------------------- |
| Task Posting    | Medium     | Requires escrow deposit verification before storage       |
| Task Board      | Low        | Simple GET endpoint + React list rendering                |
| Claim Task      | Low        | Status update + wallet assignment                         |
| Submit Proof    | Low        | Status update + proof URL storage                         |
| Manual Approval | Low        | Status check + approval flag                              |
| Payment Release | High       | Escrow signing + on-chain transaction + verification      |
| AI Auto-Release | Medium     | Groq API integration + response parsing + payment trigger |

---

## RECOMMENDATIONS

### Before Starting Development

1. **Decide on CSS approach** — Tailwind with design tokens, or vanilla CSS from `design.md`
2. **Lock the brand name** — Pick one: GigBounty, TrustAudit, or a new name
3. **Choose database** — Firebase (faster setup) or JSON file (zero dependencies)
4. **Choose React framework** — Vite (lighter, faster) or Next.js (SSR, routing built-in)
5. **Populate `Algorand.md`** — Document the SDK patterns you'll use for escrow

### During Development

1. **Build backend-first** — Steps 3–6 are the hardest; get escrow working before touching UI
2. **Use LocalNet exclusively until step 9** — Avoid TestNet rate limits during development
3. **Implement the happy path first** — Get the demo flow working end-to-end, then handle edge cases
4. **Skip AI verification initially** — It's optional and can be added in the final hour
5. **Test escrow with small amounts** — Verify payout works with 0.1 ALGO before using real bounty values

# Agentic Coding Guide for Auctra

## Project Overview

Auctra is a blockchain-based public procurement system designed to bring **transparency, accountability, and efficiency** to government tendering. It utilizes **smart contracts, distributed ledgers, and verified marketplaces** to ensure every transaction is immutable and auditable.

"Build a minimal production-ready demo for Auctra, a blockchain-based public procurement system. The demo should simulate a **single tender creation and bid submission transaction on the blockchain** to demonstrate transparency and immutability. Do not implement the full system architecture from the whitepaper—this is just a proof-of-concept.

**Core Requirements:**

1. **Blockchain Layer:** Use a simple permissioned blockchain (e.g., Hyperledger Fabric or Ethereum testnet) to store the transaction.
2. **Smart Contract:** Implement a basic contract that records:

   - Tender ID
   - Contractor name
   - Bid amount
   - Timestamp

3. **Frontend (Web UI):**

   - Simple interface with a form to create a tender.
   - Button to submit a bid.
   - Display the recorded transaction on-chain.

4. **Backend (Optional minimal API):**

   - Handle interaction between frontend and blockchain.

5. **No full-scale tender evaluation or marketplace needed.** Just show a **single successful transaction lifecycle** (create → submit → store on blockchain → view on chain).

**Goal:** A quick, minimal, demonstrable prototype showing how a government tender could be recorded immutably on the blockchain."

use docker to set up the blockchain environment and host the web application also can run locally.

"the design should be simple and modern clean and minimalistic, focusing on functionality over aesthetics. And fully responsive for both desktop and mobile devices."

This guide is optimized for **Claude Code** usage to enable rapid, agentic development with minimal context loss.

## Core Features (MVP for Demo)

- **Tender Creation:** Government creates a tender entry on the blockchain.
- **Bid Submission:** Contractors submit a bid linked to the tender.
- **Immutable Record:** Transaction stored on the blockchain ledger.
- **View Transaction:** Frontend displays the blockchain transaction details.

## Tech Stack

- **Blockchain Layer:** Hyperledger Fabric (preferred) or Ethereum Testnet
- **Smart Contracts:** Solidity (if Ethereum) or Chaincode (if Hyperledger)
- **Backend:** Node.js (TypeScript) with NestJS
- **Storage:** IPFS for documents (future), In-memory DB (demo)
- **Consensus:** PBFT (as per whitepaper, optional in MVP)

## Development Setup

- Node.js >= 18
- pnpm (preferred) or npm
- Docker & Docker Compose (for blockchain node)
- GitHub CLI (`gh`) for pull requests & issue management

## Code Style Guidelines

- **Use ES modules** (`import/export`) not CommonJS.
- Always type functions and variables (TypeScript enforced).
- Follow **SOLID principles** for service structure.
- Smart contracts must be:
  - Minimal for MVP (tender ID, contractor, bid amount, timestamp).
  - Tested before deployment.
- Commit messages follow:
  - `feat(scope): description`
  - `fix(scope): description`
  - `chore(scope): description`

Example:  
`feat(tender): add smart contract for tender creation`

## Repository Workflow

- **Branch Naming:** `feature/tender-demo`, `fix/contract-bug`, `chore/deploy-config`
- Always open a PR before merging into `main`.
- Use **rebase** to maintain clean history.
- Run **lint and tests before PR**.

## Agentic Coding Workflow with Claude

1. **Explore**:

   - Ask Claude to read the smart contract, tender service, or relevant files.
   - Do not write code yet.

2. **Plan**:

   - Request a step-by-step implementation plan.
   - Example: "think hard and plan a minimal blockchain transaction for tender creation."

3. **Implement**:

   - Ask Claude to implement code after confirming the plan.
   - Use `/clear` before switching to another feature.

4. **Deploy (Demo)**:
   - Deploy single transaction demo smart contract.
   - Share blockchain explorer link in README.

## Testing Instructions (Demo)

1. Run `pnpm chain:start` to start blockchain.
2. Deploy contract using `pnpm chain:deploy`.
3. Use web form to create a tender.
4. Submit a bid → verify blockchain hash recorded.
5. View transaction details on UI.

## Allowlist Recommendations

- `Edit` – Allow file edits
- `Bash(git commit:*)` – Allow commits
- `mcp__puppeteer__puppeteer_navigate` – Optional (UI snapshotting)
- `Fetch` – Allow reading whitepaper/contract files dynamically

## Known Quirks

- This is a **proof-of-concept**, not full production.
- Smart contract supports only **one tender & one bid** for MVP.
- Off-chain storage (IPFS) is stubbed.

## Future Enhancements

- Multi-tender management
- Automated bid evaluation
- Government digital signature integration
- Real-time hash-like price monitoring
- Interoperability with e-GP system

## Security Reminders

- Do not run `claude --dangerously-skip-permissions` outside containerized dev environment.
- Never commit `.env` files.
- Regularly clear Claude context (`/clear`) to avoid leaks.

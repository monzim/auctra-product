# Auctra - Blockchain-Based Public Procurement Demo

This project is a minimal, production-ready proof-of-concept for Auctra, a blockchain-based public procurement system. It simulates the core user flows of company registration, admin verification, and the immutable, versioned recording of verified data onto an Ethereum blockchain and IPFS.

## Core Features

*   **Company Submission**: Companies can register their details and upload supporting documents.
*   **Admin Verification**: An admin can review, approve, or reject submissions.
*   **Immutable Storage**: Approved company records are stored on-chain (via a local Ganache testnet) and supporting documents are stored on IPFS.
*   **Versioning**: Updates to a verified company's record create a new version on the blockchain, linked to the previous record.
*   **On-Chain History**: The admin panel provides a full, auditable history of every version of a company's record stored on the blockchain.

## Tech Stack

*   **Framework**: Next.js (App Router)
*   **Styling**: Tailwind CSS with shadcn/ui
*   **Blockchain**: Ethereum (local testnet via Ganache)
*   **Smart Contracts**: Solidity
*   **Blockchain Interaction**: ethers.js
*   **Decentralized Storage**: IPFS (local node via Kubo)
*   **Containerization**: Docker and Docker Compose

---

## Prerequisites

Before you begin, ensure you have the following installed:
*   [Node.js](https://nodejs.org/en/) (v18 or later recommended)
*   [npm](https://www.npmjs.com/) (or your preferred package manager)
*   [Docker](https://www.docker.com/products/docker-desktop/)
*   [Docker Compose](https://docs.docker.com/compose/install/)

---

## Setup and Running the Application

Follow these steps to get the application running locally.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Install Dependencies

The project has two separate `package.json` files: one for the Next.js application and one for the smart contracts.

```bash
# Install dependencies for the main Next.js app
npm install --legacy-peer-deps

# Install dependencies for the smart contracts
cd contracts
npm install
cd ..
```

### 3. Start Infrastructure Services

This command starts the local IPFS and Ganache nodes in the background.

```bash
docker-compose up -d
```
You can check the status of the containers with `docker-compose ps`.

### 4. Deploy the Smart Contract

With the Ganache container running, deploy the `CompanyRegistry` smart contract to the local test network.

```bash
npm run deploy-contract
```

This script will compile the contract and deploy it. On success, it will create a `src/lib/blockchain/contract-config.json` file, which the Next.js app uses to communicate with the contract.

### 5. Run the Next.js Application

```bash
npm run dev
```

The application should now be running at [http://localhost:3000](http://localhost:3000).

---

## Usage Examples

### 1. Company Submission (New Company)

1.  Navigate to [http://localhost:3000/company/submit](http://localhost:3000/company/submit).
2.  Fill out all the fields:
    *   **Company ID**: A unique identifier (e.g., `COMP-001`).
    *   **Company Name**: The legal name of the company.
    *   **Registration Number**: The official registration number.
    *   **Contact Details**: Email or phone number.
    *   **Supporting Document**: Upload a PDF, JPG, or PNG file (max 10MB).
3.  Click "Submit for Verification". You should see a success message.

### 2. Admin Verification

1.  Navigate to the admin dashboard at [http://localhost:3000/admin](http://localhost:3000/admin).
2.  You will see the new submission in the "Pending Submissions" table.
3.  Click "View Details" to go to the submission detail page.
4.  Review the company's information and view the supporting document by clicking the link.
5.  **To Approve**: Click the "Approve Submission" button. The application will:
    *   Upload the document to IPFS.
    *   Commit the record to the blockchain.
    *   If successful, you will be redirected back to the admin dashboard, and the submission will be gone from the pending list.
6.  **To Reject**: Click the "Reject Submission" button, provide a reason, and confirm.

### 3. Company Update and Version History

1.  Submit and approve a company as described above (e.g., `COMP-001`).
2.  Go back to the submission form at [http://localhost:3000/company/submit](http://localhost:3000/company/submit).
3.  Submit the form again with the **same Company ID** (`COMP-001`) but with updated information (e.g., a new contact detail or a new document).
4.  Go back to the admin dashboard at [http://localhost:3000/admin](http://localhost:3000/admin).
5.  Approve the new submission for `COMP-001`.
6.  Now, find the company in your local `db/verified.json` file and get its submission `id`. Navigate to `http://localhost:3000/admin/submission/<id>` (since it's no longer in the pending list, you can't click from the dashboard for the *first* verified record, but you can for subsequent pending updates).
7.  On the detail page, you will now see the **On-Chain Version History** card, showing both `v1` and `v2` of the company's record, each with a unique IPFS hash and linked by the `previous_hash`.

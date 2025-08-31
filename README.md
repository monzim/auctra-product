# Auctra - Blockchain-based Public Procurement System

> **Demo Version**: This is a minimal production-ready demo showcasing blockchain-based tender creation and bid submission for transparent public procurement.

Auctra revolutionizes government procurement through blockchain technology, ensuring transparency, immutability, and accountability in every tender and bid transaction.

## 🎯 Project Overview

This demo implements the core functionality of Auctra's blockchain-based procurement system:
- **Tender Creation**: Government agencies can create tenders on the blockchain
- **Bid Submission**: Contractors can submit transparent, immutable bids
- **Smart Contracts**: Ethereum-based contracts ensure data integrity
- **Modern UI**: Responsive, clean interface for all stakeholders

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Blockchain    │
│   (Next.js)     │◄──►│   (NestJS)      │◄──►│   (Hardhat)     │
│                 │    │                 │    │                 │
│ - Tender Forms  │    │ - REST API      │    │ - Smart Contract│
│ - Bid Forms     │    │ - Blockchain    │    │ - Local Network │
│ - Wallet Connect│    │   Integration   │    │ - Immutable Data│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- npm or pnpm
- MetaMask browser extension (for blockchain interaction)

### Option 1: Docker Setup (Recommended)
```bash
# Clone and setup
git clone <repository>
cd auctra-product
./scripts/setup.sh

# Start all services with Docker
docker-compose up

# Access the application
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:3001
# - Blockchain: http://localhost:8545
```

### Option 2: Manual Setup
```bash
# 1. Install dependencies
npm install
cd backend && npm install && cd ..

# 2. Setup environment
cp .env.example .env
cp backend/.env.example backend/.env

# 3. Start blockchain network
npm run chain:start

# 4. Deploy smart contracts (in new terminal)
npm run chain:deploy

# 5. Start backend API (in new terminal)
npm run backend:dev

# 6. Start frontend (in new terminal)
npm run dev
```

## 📝 Usage Guide

### For Government Users (Tender Creation)

1. **Connect Wallet**
   - Install MetaMask browser extension
   - Navigate to `/blockchain` page
   - Click "Connect Wallet"

2. **Create Tender**
   - Click "Create Tender"
   - Fill in tender details:
     - Title and description
     - Budget (in ETH)
     - Deadline date
   - Submit to blockchain

3. **View Results**
   - Transaction recorded immutably
   - Tender appears in public listing
   - Blockchain hash provided as proof

### For Contractors (Bid Submission)

1. **Connect Wallet**
   - Use different MetaMask account than government
   - Navigate to `/blockchain` page
   - Connect wallet

2. **Browse Tenders**
   - View all active tenders
   - Check budgets and deadlines
   - Select tender to bid on

3. **Submit Bid**
   - Enter company name
   - Specify bid amount (in ETH)
   - Provide detailed proposal
   - Submit to blockchain

4. **Track Bids**
   - All bids recorded immutably
   - View transaction confirmations
   - Monitor bid status

## 🛠️ Development

### Project Structure
```
auctra-product/
├── contracts/              # Smart contracts (Solidity)
├── backend/                # NestJS API server
│   └── src/
│       ├── modules/        # Feature modules
│       └── common/         # Shared utilities
├── src/                    # Next.js frontend
│   ├── app/               # App router pages
│   ├── components/        # React components
│   ├── lib/              # Utilities
│   └── hooks/            # React hooks
├── docker/               # Docker configurations
├── scripts/              # Deployment scripts
└── test/                 # Smart contract tests
```

### Available Scripts

**Blockchain:**
- `npm run chain:start` - Start Hardhat local blockchain
- `npm run chain:compile` - Compile smart contracts
- `npm run chain:deploy` - Deploy contracts to local network
- `npm run test:contracts` - Run contract tests

**Backend:**
- `npm run backend:dev` - Start backend in development
- `npm run backend:build` - Build backend for production
- `npm run backend:start` - Start backend in production

**Frontend:**
- `npm run dev` - Start Next.js development server
- `npm run build` - Build frontend for production
- `npm run start` - Start production frontend

**Docker:**
- `docker-compose up` - Start all services
- `docker-compose down` - Stop all services

### Testing

**Smart Contract Tests:**
```bash
npm run test:contracts
```

**Backend Tests:**
```bash
npm run test:backend
```

## 🔗 API Endpoints

### Tender Management
- `GET /tenders` - Get all tenders
- `POST /tenders` - Create new tender
- `GET /tenders/:id` - Get tender details
- `GET /tenders/:id/bids` - Get tender bids

### Bid Management
- `GET /bids` - Get all bids
- `POST /bids` - Submit new bid
- `GET /bids/:id` - Get bid details
- `GET /bids/contractor/:address` - Get contractor bids

Full API documentation available at: `http://localhost:3001/api`

## 🔐 Smart Contract Functions

### AuctraTender.sol
**Key Functions:**
- `createTender(title, description, budget, deadline)` - Create new tender
- `submitBid(tenderId, contractorName, bidAmount, proposal)` - Submit bid
- `getTender(tenderId)` - Get tender details
- `getAllTenders()` - Get all tender IDs
- `getTenderBids(tenderId)` - Get bids for tender

**Events:**
- `TenderCreated` - Emitted on tender creation
- `BidSubmitted` - Emitted on bid submission
- `TenderAwarded` - Emitted when tender is awarded

## 🌐 Network Configuration

**Local Development:**
- Network: Hardhat Local
- Chain ID: 1337
- RPC URL: http://localhost:8545
- Block Explorer: N/A (local)

**MetaMask Setup:**
1. Add custom network in MetaMask
2. Network Name: "Auctra Local"
3. RPC URL: "http://localhost:8545"
4. Chain ID: 1337
5. Currency: ETH

## 🔧 Configuration

### Environment Variables

**Frontend (.env):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_BLOCKCHAIN_URL=http://localhost:8545
```

**Backend (backend/.env):**
```env
NODE_ENV=development
PORT=3001
BLOCKCHAIN_NETWORK_URL=http://localhost:8545
```

## 📋 Features Implemented

### ✅ Core Features
- [x] Smart contract for tender/bid management
- [x] Tender creation with blockchain recording
- [x] Bid submission with immutable storage
- [x] MetaMask wallet integration
- [x] Responsive modern UI
- [x] Real-time blockchain interaction
- [x] Transaction confirmation system

### ✅ Security Features
- [x] Ownable contract with access control
- [x] ReentrancyGuard protection
- [x] Input validation and sanitation
- [x] Deadline enforcement
- [x] Government self-bidding prevention

### ✅ User Experience
- [x] Clean, minimalistic design
- [x] Mobile-responsive interface
- [x] Real-time status updates
- [x] Error handling and feedback
- [x] Loading states and confirmations

## 🎯 Demo Scenarios

### Scenario 1: Complete Tender Lifecycle
1. Government creates "Road Construction" tender (5 ETH budget)
2. Contractor A bids 4.2 ETH
3. Contractor B bids 3.8 ETH
4. All transactions recorded on blockchain
5. Government can view and compare bids transparently

### Scenario 2: Multiple Tender Management
1. Create multiple tenders simultaneously
2. Different contractors bid on different tenders
3. Track all activities via blockchain explorer
4. Demonstrate scalability of the system

## 🚧 Production Considerations

This is a **demo version**. For production deployment:

- [ ] Implement comprehensive access control
- [ ] Add digital signature verification
- [ ] Integrate with existing e-GP systems
- [ ] Add automated bid evaluation
- [ ] Implement IPFS for document storage
- [ ] Add audit trails and reporting
- [ ] Configure mainnet/testnet deployment
- [ ] Add comprehensive monitoring

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- GitHub Issues: [Create an issue](https://github.com/your-repo/issues)
- Documentation: [View docs](https://docs.auctra.com)

---

**Built with ❤️ for transparent public procurement**
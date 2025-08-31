// Mock data for the Auctra procurement system

export interface User {
  id: string;
  name: string;
  email: string;
  role: "procuring_officer" | "vendor";
  organization: string;
  avatar?: string;
}

export interface Tender {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  status: "draft" | "published" | "closed" | "awarded";
  publishDate: string;
  closingDate: string;
  procuringOfficer: string;
  organization: string;
  requirements: string[];
  documents: string[];
  blockchainHash?: string;
  bidCount: number;
}

export interface Bid {
  id: string;
  tenderId: string;
  vendorId: string;
  vendorName: string;
  amount: number;
  technicalScore?: number;
  complianceScore?: number;
  totalScore?: number;
  status: "submitted" | "locked" | "evaluated" | "winner" | "rejected";
  submissionDate: string;
  documents: string[];
  digitalSignature?: string;
  linkedProducts?: LinkedProduct[];
  blockchainHash?: string;
  internalBlockchainHash?: string;
  publicBlockchainHash?: string;
}

export interface LinkedProduct {
  productId: string;
  productName: string;
  lockedPrice: number;
  lockTimestamp: string;
  quantity: number;
  totalValue: number;
  priceVerificationHash: string;
  productBlockchainHash: string;
}

export interface Contract {
  id: string;
  tenderId: string;
  vendorId: string;
  amount: number;
  startDate: string;
  endDate: string;
  deliverables: string[];
  milestones: Milestone[];
  sla: string;
  penalties: string;
  paymentTerms: string;
  blockchainHash?: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: "pending" | "in_progress" | "completed" | "verified" | "paid";
  amount: number;
  documents: string[];
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  vendorId: string;
  vendorName: string;
  specifications: Record<string, string>;
  images: string[];
  priceHistory: PriceHistoryEntry[];
  companyPublicKey: string;
  lastUpdated: string;
  blockchainVerifications: BlockchainVerification[];
}

export interface PriceHistoryEntry {
  date: string;
  price: number;
  blockchainHash: string;
  digitalSignature: string;
  transactionId: string;
}

export interface BlockchainVerification {
  timestamp: string;
  blockHash: string;
  transactionHash: string;
  gasUsed: number;
  confirmations: number;
  verified: boolean;
}

export interface CompanySignature {
  companyName: string;
  publicKey: string;
  privateKeyHash: string; // For demo purposes only
  timestamp: string;
  signature: string;
}

// Mock users
export const mockUsers: User[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@gov.example",
    role: "procuring_officer",
    organization: "Department of Infrastructure",
    avatar: "/professional-woman-diverse.png",
  },
  {
    id: "2",
    name: "TechCorp Solutions",
    email: "contact@techcorp.example",
    role: "vendor",
    organization: "TechCorp Solutions Ltd.",
    avatar: "/abstract-tech-logo.png",
  },
  {
    id: "3",
    name: "BuildRight Construction",
    email: "info@buildright.example",
    role: "vendor",
    organization: "BuildRight Construction Inc.",
    avatar: "/construction-company-logo.png",
  },
];

// Mock tenders
export const mockTenders: Tender[] = [
  {
    id: "1",
    title: "IT Infrastructure Modernization",
    description:
      "Complete overhaul of government IT infrastructure including servers, networking equipment, and security systems.",
    category: "Information Technology",
    budget: 2500000,
    status: "published",
    publishDate: "2024-01-15",
    closingDate: "2024-02-15",
    procuringOfficer: "Sarah Johnson",
    organization: "Department of Infrastructure",
    requirements: [
      "ISO 27001 certification required",
      "Minimum 5 years experience in government projects",
      "Local presence mandatory",
      "24/7 support capability",
    ],
    documents: ["RFP_IT_Infrastructure.pdf", "Technical_Specifications.pdf"],
    blockchainHash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
    bidCount: 8,
  },
  {
    id: "2",
    title: "Road Construction Project - Highway 401",
    description:
      "Construction of 25km highway section with modern safety features and environmental considerations.",
    category: "Construction",
    budget: 15000000,
    status: "closed",
    publishDate: "2024-01-01",
    closingDate: "2024-01-31",
    procuringOfficer: "Sarah Johnson",
    organization: "Department of Transportation",
    requirements: [
      "Grade A contractor license",
      "Environmental compliance certification",
      "Previous highway construction experience",
      "Equipment capacity verification",
    ],
    documents: ["Highway_RFP.pdf", "Environmental_Requirements.pdf"],
    blockchainHash: "0x2b3c4d5e6f7890abcdef1234567890abcdef1234",
    bidCount: 12,
  },
  {
    id: "3",
    title: "Medical Equipment Procurement",
    description:
      "Procurement of advanced medical equipment for regional hospitals including MRI machines and surgical equipment.",
    category: "Healthcare",
    budget: 8500000,
    status: "draft",
    publishDate: "2024-02-01",
    closingDate: "2024-03-01",
    procuringOfficer: "Sarah Johnson",
    organization: "Department of Health",
    requirements: [
      "FDA/Health Canada approval",
      "Warranty minimum 5 years",
      "Training and installation included",
      "Maintenance contract available",
    ],
    documents: ["Medical_Equipment_RFP.pdf"],
    bidCount: 0,
  },
];

// Mock bids
export const mockBids: Bid[] = [
  {
    id: "1",
    tenderId: "1",
    vendorId: "2",
    vendorName: "TechCorp Solutions",
    amount: 2350000,
    technicalScore: 85,
    complianceScore: 92,
    totalScore: 88.5,
    status: "evaluated",
    submissionDate: "2024-02-10",
    documents: ["Technical_Proposal.pdf", "Financial_Proposal.pdf"],
    digitalSignature: "DS_TECHCORP_20240210_1234",
    linkedProducts: [
      {
        productId: "1",
        productName: "Enterprise Server Rack",
        lockedPrice: 25000,
        lockTimestamp: "2024-02-10T09:30:00Z",
        quantity: 94,
        totalValue: 2350000,
        priceVerificationHash: "0x2b3c4d5e6f7890abcdef1234567890abcdef23",
        productBlockchainHash: "0x2b3c4d5e6f7890abcdef1234567890abcdef23",
      },
    ],
    blockchainHash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
    internalBlockchainHash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
    publicBlockchainHash: "0x9f8e7d6c5b4a39281726354849576869",
  },
  {
    id: "2",
    tenderId: "2",
    vendorId: "3",
    vendorName: "BuildRight Construction",
    amount: 14200000,
    technicalScore: 78,
    complianceScore: 88,
    totalScore: 83,
    status: "winner",
    submissionDate: "2024-01-28",
    documents: ["Construction_Proposal.pdf", "Equipment_List.pdf"],
    digitalSignature: "DS_BUILDRIGHT_20240128_5678",
    linkedProducts: [
      {
        productId: "2",
        productName: "Road Paving Equipment",
        lockedPrice: 435000,
        lockTimestamp: "2024-01-28T14:15:00Z",
        quantity: 32,
        totalValue: 13920000,
        priceVerificationHash: "0x5e6f7890abcdef1234567890abcdef123456789a",
        productBlockchainHash: "0x5e6f7890abcdef1234567890abcdef123456789a",
      },
    ],
    blockchainHash: "0x2b3c4d5e6f7890abcdef1234567890abcdef1234",
    internalBlockchainHash: "0x2b3c4d5e6f7890abcdef1234567890abcdef1234",
    publicBlockchainHash: "0x8e7d6c5b4a39281726354849576869ab",
  },
];

// Mock products
export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Enterprise Server Rack",
    category: "IT Hardware",
    description:
      "High-performance server rack with redundant power supply and advanced cooling system.",
    price: 25000,
    vendorId: "2",
    vendorName: "TechCorp Solutions",
    specifications: {
      CPU: "Intel Xeon Gold 6248R",
      RAM: "256GB DDR4",
      Storage: "4TB NVMe SSD",
      Power: "1600W Redundant PSU",
    },
    images: ["/server-rack.png"],
    priceHistory: [
      {
        date: "2024-01-01",
        price: 24000,
        blockchainHash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
        digitalSignature: "SIG_TECHCORP_20240101_ABC123",
        transactionId: "tx_001_server_price_update",
      },
      {
        date: "2024-02-15",
        price: 25000,
        blockchainHash: "0x2b3c4d5e6f7890abcdef1234567890abcdef23",
        digitalSignature: "SIG_TECHCORP_20240215_DEF456",
        transactionId: "tx_002_server_price_update",
      },
    ],
    companyPublicKey:
      "04a1b2c3d4e5f6789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    lastUpdated: "2024-02-15T10:30:00Z",
    blockchainVerifications: [
      {
        timestamp: "2024-02-15T10:30:00Z",
        blockHash: "0x2b3c4d5e6f7890abcdef1234567890abcdef23",
        transactionHash: "0x3c4d5e6f7890abcdef1234567890abcdef34",
        gasUsed: 21000,
        confirmations: 156,
        verified: true,
      },
    ],
  },
  {
    id: "2",
    name: "Road Paving Equipment",
    category: "Construction Equipment",
    description:
      "Professional asphalt paving machine with GPS guidance and automated leveling.",
    price: 450000,
    vendorId: "3",
    vendorName: "BuildRight Construction",
    specifications: {
      Width: "4.5m paving width",
      Speed: "0-18 m/min",
      Hopper: "15 ton capacity",
      Engine: "350HP Tier 4 Final",
    },
    images: ["/road-paving-machine.png"],
    priceHistory: [
      {
        date: "2024-01-01",
        price: 420000,
        blockchainHash: "0x4d5e6f7890abcdef1234567890abcdef12345678",
        digitalSignature: "SIG_BUILDRIGHT_20240101_GHI789",
        transactionId: "tx_003_paving_price_update",
      },
      {
        date: "2024-01-20",
        price: 435000,
        blockchainHash: "0x5e6f7890abcdef1234567890abcdef123456789a",
        digitalSignature: "SIG_BUILDRIGHT_20240120_JKL012",
        transactionId: "tx_004_paving_price_update",
      },
      {
        date: "2024-02-10",
        price: 450000,
        blockchainHash: "0x6f7890abcdef1234567890abcdef123456789ab",
        digitalSignature: "SIG_BUILDRIGHT_20240210_MNO345",
        transactionId: "tx_005_paving_price_update",
      },
    ],
    companyPublicKey:
      "04b2c3d4e5f6789abcdef0123456789abcdef0123456789abcdef0123456789abcdef01",
    lastUpdated: "2024-02-10T14:45:00Z",
    blockchainVerifications: [
      {
        timestamp: "2024-02-10T14:45:00Z",
        blockHash: "0x6f7890abcdef1234567890abcdef123456789ab",
        transactionHash: "0x7890abcdef1234567890abcdef123456789abc",
        gasUsed: 23500,
        confirmations: 89,
        verified: true,
      },
    ],
  },
];

export const mockCompanySignatures: CompanySignature[] = [
  {
    companyName: "TechCorp Solutions",
    publicKey:
      "04a1b2c3d4e5f6789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    privateKeyHash: "sha256_hash_of_private_key_techcorp",
    timestamp: "2024-02-15T10:30:00Z",
    signature: "SIG_TECHCORP_20240215_DEF456",
  },
  {
    companyName: "BuildRight Construction",
    publicKey:
      "04b2c3d4e5f6789abcdef0123456789abcdef0123456789abcdef0123456789abcdef01",
    privateKeyHash: "sha256_hash_of_private_key_buildright",
    timestamp: "2024-02-10T14:45:00Z",
    signature: "SIG_BUILDRIGHT_20240210_MNO345",
  },
];

// Mock price trends data
export const mockPriceTrends = [
  { month: "Jan", servers: 24000, construction: 420000, medical: 180000 },
  { month: "Feb", servers: 25000, construction: 450000, medical: 185000 },
  { month: "Mar", servers: 23500, construction: 435000, medical: 175000 },
  { month: "Apr", servers: 26000, construction: 460000, medical: 190000 },
  { month: "May", servers: 25500, construction: 445000, medical: 188000 },
  { month: "Jun", servers: 24800, construction: 440000, medical: 182000 },
];

// Mock analytics data
export const mockAnalytics = {
  totalTenders: 156,
  activeTenders: 23,
  totalBids: 1247,
  averageBidsPerTender: 8.2,
  totalValue: 125000000,
  completedProjects: 89,
  onTimeDelivery: 94.2,
  costSavings: 12.5,
};

// Mock contracts and milestones data
export const mockContracts: Contract[] = [
  {
    id: "1",
    tenderId: "2",
    vendorId: "3",
    amount: 14200000,
    startDate: "2024-02-01",
    endDate: "2024-08-01",
    deliverables: [
      "Complete highway construction (25km)",
      "Installation of safety barriers",
      "Road marking and signage",
      "Environmental restoration",
      "Quality assurance documentation",
    ],
    milestones: [
      {
        id: "1",
        title: "Site Preparation & Permits",
        description:
          "Clear site, obtain all necessary permits, and set up construction infrastructure",
        dueDate: "2024-03-01",
        status: "completed",
        amount: 2840000,
        documents: ["site_clearance_report.pdf", "permits_documentation.pdf"],
      },
      {
        id: "2",
        title: "Foundation & Base Layer",
        description:
          "Excavation, foundation laying, and base layer construction",
        dueDate: "2024-04-15",
        status: "verified",
        amount: 4260000,
        documents: ["foundation_inspection.pdf", "material_certificates.pdf"],
      },
      {
        id: "3",
        title: "Asphalt Laying & Surface Work",
        description:
          "Main asphalt laying, surface finishing, and initial quality checks",
        dueDate: "2024-06-01",
        status: "in_progress",
        amount: 4260000,
        documents: [],
      },
      {
        id: "4",
        title: "Safety Features Installation",
        description:
          "Install barriers, signage, lighting, and other safety features",
        dueDate: "2024-07-01",
        status: "pending",
        amount: 1420000,
        documents: [],
      },
      {
        id: "5",
        title: "Final Inspection & Handover",
        description:
          "Final quality inspection, documentation, and project handover",
        dueDate: "2024-08-01",
        status: "pending",
        amount: 1420000,
        documents: [],
      },
    ],
    sla: "24/7 emergency response, 99.5% uptime guarantee, maximum 4-hour response time for critical issues",
    penalties:
      "2% of milestone value for delays beyond 7 days, 5% for delays beyond 14 days, contract termination for delays beyond 30 days",
    paymentTerms:
      "Payment upon milestone completion and verification, 30-day payment terms, 10% retention until final acceptance",
    blockchainHash: "0x3c4d5e6f7890abcdef1234567890abcdef123456",
  },
];

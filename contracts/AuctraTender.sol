// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract AuctraTender is Ownable, ReentrancyGuard {
    struct Tender {
        uint256 id;
        string title;
        string description;
        uint256 budget;
        uint256 deadline;
        address government;
        bool isActive;
        bool isAwarded;
        uint256 createdAt;
    }

    struct Bid {
        uint256 id;
        uint256 tenderId;
        address contractor;
        string contractorName;
        uint256 bidAmount;
        string proposal;
        uint256 submittedAt;
        bool isWithdrawn;
    }

    mapping(uint256 => Tender) public tenders;
    mapping(uint256 => Bid) public bids;
    mapping(uint256 => uint256[]) public tenderToBids;
    mapping(address => uint256[]) public contractorBids;

    uint256 public nextTenderId = 1;
    uint256 public nextBidId = 1;
    
    uint256[] public allTenderIds;
    uint256[] public allBidIds;

    event TenderCreated(
        uint256 indexed tenderId,
        string title,
        uint256 budget,
        uint256 deadline,
        address indexed government
    );

    event BidSubmitted(
        uint256 indexed bidId,
        uint256 indexed tenderId,
        address indexed contractor,
        string contractorName,
        uint256 bidAmount
    );

    event TenderAwarded(
        uint256 indexed tenderId,
        uint256 indexed winningBidId,
        address indexed winner
    );

    modifier onlyGovernment(uint256 tenderId) {
        require(tenders[tenderId].government == msg.sender, "Only tender creator can perform this action");
        _;
    }

    modifier tenderExists(uint256 tenderId) {
        require(tenders[tenderId].id != 0, "Tender does not exist");
        _;
    }

    modifier tenderActive(uint256 tenderId) {
        require(tenders[tenderId].isActive, "Tender is not active");
        require(block.timestamp <= tenders[tenderId].deadline, "Tender deadline has passed");
        _;
    }

    constructor() Ownable(msg.sender) {}

    function createTender(
        string memory title,
        string memory description,
        uint256 budget,
        uint256 deadline
    ) external returns (uint256) {
        require(deadline > block.timestamp, "Deadline must be in the future");
        require(budget > 0, "Budget must be greater than 0");
        require(bytes(title).length > 0, "Title cannot be empty");

        uint256 tenderId = nextTenderId++;
        
        tenders[tenderId] = Tender({
            id: tenderId,
            title: title,
            description: description,
            budget: budget,
            deadline: deadline,
            government: msg.sender,
            isActive: true,
            isAwarded: false,
            createdAt: block.timestamp
        });

        allTenderIds.push(tenderId);

        emit TenderCreated(tenderId, title, budget, deadline, msg.sender);
        return tenderId;
    }

    function submitBid(
        uint256 tenderId,
        string memory contractorName,
        uint256 bidAmount,
        string memory proposal
    ) external tenderExists(tenderId) tenderActive(tenderId) nonReentrant returns (uint256) {
        require(bidAmount > 0, "Bid amount must be greater than 0");
        require(bytes(contractorName).length > 0, "Contractor name cannot be empty");
        require(msg.sender != tenders[tenderId].government, "Government cannot bid on their own tender");

        uint256 bidId = nextBidId++;
        
        bids[bidId] = Bid({
            id: bidId,
            tenderId: tenderId,
            contractor: msg.sender,
            contractorName: contractorName,
            bidAmount: bidAmount,
            proposal: proposal,
            submittedAt: block.timestamp,
            isWithdrawn: false
        });

        tenderToBids[tenderId].push(bidId);
        contractorBids[msg.sender].push(bidId);
        allBidIds.push(bidId);

        emit BidSubmitted(bidId, tenderId, msg.sender, contractorName, bidAmount);
        return bidId;
    }

    function getTender(uint256 tenderId) external view returns (Tender memory) {
        require(tenders[tenderId].id != 0, "Tender does not exist");
        return tenders[tenderId];
    }

    function getBid(uint256 bidId) external view returns (Bid memory) {
        require(bids[bidId].id != 0, "Bid does not exist");
        return bids[bidId];
    }

    function getTenderBids(uint256 tenderId) external view returns (uint256[] memory) {
        return tenderToBids[tenderId];
    }

    function getContractorBids(address contractor) external view returns (uint256[] memory) {
        return contractorBids[contractor];
    }

    function getAllTenders() external view returns (uint256[] memory) {
        return allTenderIds;
    }

    function getAllBids() external view returns (uint256[] memory) {
        return allBidIds;
    }

    function getTenderCount() external view returns (uint256) {
        return allTenderIds.length;
    }

    function getBidCount() external view returns (uint256) {
        return allBidIds.length;
    }

    function closeTender(uint256 tenderId) external onlyGovernment(tenderId) tenderExists(tenderId) {
        tenders[tenderId].isActive = false;
    }

    function awardTender(uint256 tenderId, uint256 winningBidId) 
        external 
        onlyGovernment(tenderId) 
        tenderExists(tenderId) 
    {
        require(bids[winningBidId].tenderId == tenderId, "Bid does not belong to this tender");
        require(!bids[winningBidId].isWithdrawn, "Cannot award to withdrawn bid");
        
        tenders[tenderId].isAwarded = true;
        tenders[tenderId].isActive = false;

        emit TenderAwarded(tenderId, winningBidId, bids[winningBidId].contractor);
    }
}
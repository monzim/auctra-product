import { expect } from "chai";
import pkg from "hardhat";
const { ethers } = pkg;

describe("AuctraTender", function () {
  let auctraTender;
  let owner;
  let government;
  let contractor1;
  let contractor2;

  beforeEach(async function () {
    [owner, government, contractor1, contractor2] = await ethers.getSigners();

    const AuctraTender = await ethers.getContractFactory("AuctraTender");
    auctraTender = await AuctraTender.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await auctraTender.owner()).to.equal(owner.address);
    });

    it("Should initialize with zero tenders and bids", async function () {
      expect(await auctraTender.getTenderCount()).to.equal(0);
      expect(await auctraTender.getBidCount()).to.equal(0);
    });
  });

  describe("Tender Creation", function () {
    it("Should create a tender successfully", async function () {
      const title = "Road Construction";
      const description = "Build a 10km road";
      const budget = ethers.parseEther("100");
      const deadline = Math.floor(Date.now() / 1000) + 86400; // 1 day from now

      await expect(
        auctraTender.connect(government).createTender(title, description, budget, deadline)
      )
        .to.emit(auctraTender, "TenderCreated")
        .withArgs(1, title, budget, deadline, government.address);

      const tender = await auctraTender.getTender(1);
      expect(tender.title).to.equal(title);
      expect(tender.description).to.equal(description);
      expect(tender.budget).to.equal(budget);
      expect(tender.government).to.equal(government.address);
      expect(tender.isActive).to.be.true;
      expect(tender.isAwarded).to.be.false;
    });

    it("Should revert if deadline is in the past", async function () {
      const deadline = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago

      await expect(
        auctraTender.connect(government).createTender(
          "Test Tender",
          "Description",
          ethers.parseEther("10"),
          deadline
        )
      ).to.be.revertedWith("Deadline must be in the future");
    });

    it("Should revert if budget is zero", async function () {
      const deadline = Math.floor(Date.now() / 1000) + 86400;

      await expect(
        auctraTender.connect(government).createTender(
          "Test Tender",
          "Description",
          0,
          deadline
        )
      ).to.be.revertedWith("Budget must be greater than 0");
    });
  });

  describe("Bid Submission", function () {
    let tenderId;
    let deadline;

    beforeEach(async function () {
      deadline = Math.floor(Date.now() / 1000) + 86400;
      const tx = await auctraTender.connect(government).createTender(
        "Road Construction",
        "Build a 10km road",
        ethers.parseEther("100"),
        deadline
      );
      const receipt = await tx.wait();
      tenderId = 1;
    });

    it("Should submit a bid successfully", async function () {
      const contractorName = "ABC Construction";
      const bidAmount = ethers.parseEther("80");
      const proposal = "We will complete this project in 6 months";

      await expect(
        auctraTender.connect(contractor1).submitBid(tenderId, contractorName, bidAmount, proposal)
      )
        .to.emit(auctraTender, "BidSubmitted")
        .withArgs(1, tenderId, contractor1.address, contractorName, bidAmount);

      const bid = await auctraTender.getBid(1);
      expect(bid.tenderId).to.equal(tenderId);
      expect(bid.contractor).to.equal(contractor1.address);
      expect(bid.contractorName).to.equal(contractorName);
      expect(bid.bidAmount).to.equal(bidAmount);
      expect(bid.proposal).to.equal(proposal);
      expect(bid.isWithdrawn).to.be.false;
    });

    it("Should prevent government from bidding on their own tender", async function () {
      await expect(
        auctraTender.connect(government).submitBid(
          tenderId,
          "Gov Company",
          ethers.parseEther("80"),
          "Proposal"
        )
      ).to.be.revertedWith("Government cannot bid on their own tender");
    });

    it("Should revert if bid amount is zero", async function () {
      await expect(
        auctraTender.connect(contractor1).submitBid(
          tenderId,
          "ABC Construction",
          0,
          "Proposal"
        )
      ).to.be.revertedWith("Bid amount must be greater than 0");
    });

    it("Should track multiple bids for a tender", async function () {
      // First bid
      await auctraTender.connect(contractor1).submitBid(
        tenderId,
        "ABC Construction",
        ethers.parseEther("80"),
        "Proposal 1"
      );

      // Second bid
      await auctraTender.connect(contractor2).submitBid(
        tenderId,
        "XYZ Construction",
        ethers.parseEther("75"),
        "Proposal 2"
      );

      const tenderBids = await auctraTender.getTenderBids(tenderId);
      expect(tenderBids.length).to.equal(2);
    });
  });

  describe("Tender Management", function () {
    let tenderId;

    beforeEach(async function () {
      const deadline = Math.floor(Date.now() / 1000) + 86400;
      await auctraTender.connect(government).createTender(
        "Road Construction",
        "Build a 10km road",
        ethers.parseEther("100"),
        deadline
      );
      tenderId = 1;

      // Submit a bid
      await auctraTender.connect(contractor1).submitBid(
        tenderId,
        "ABC Construction",
        ethers.parseEther("80"),
        "Great proposal"
      );
    });

    it("Should allow government to close tender", async function () {
      await auctraTender.connect(government).closeTender(tenderId);
      
      const tender = await auctraTender.getTender(tenderId);
      expect(tender.isActive).to.be.false;
    });

    it("Should allow government to award tender", async function () {
      const bidId = 1;
      
      await expect(
        auctraTender.connect(government).awardTender(tenderId, bidId)
      )
        .to.emit(auctraTender, "TenderAwarded")
        .withArgs(tenderId, bidId, contractor1.address);

      const tender = await auctraTender.getTender(tenderId);
      expect(tender.isAwarded).to.be.true;
      expect(tender.isActive).to.be.false;
    });

    it("Should prevent non-government from closing tender", async function () {
      await expect(
        auctraTender.connect(contractor1).closeTender(tenderId)
      ).to.be.revertedWith("Only tender creator can perform this action");
    });
  });

  describe("Data Retrieval", function () {
    beforeEach(async function () {
      // Create two tenders
      const deadline = Math.floor(Date.now() / 1000) + 86400;
      
      await auctraTender.connect(government).createTender(
        "Road Construction",
        "Build a 10km road",
        ethers.parseEther("100"),
        deadline
      );

      await auctraTender.connect(government).createTender(
        "Bridge Construction",
        "Build a bridge",
        ethers.parseEther("200"),
        deadline
      );

      // Submit bids for first tender
      await auctraTender.connect(contractor1).submitBid(
        1,
        "ABC Construction",
        ethers.parseEther("80"),
        "Proposal 1"
      );

      await auctraTender.connect(contractor2).submitBid(
        1,
        "XYZ Construction",
        ethers.parseEther("85"),
        "Proposal 2"
      );
    });

    it("Should return all tenders", async function () {
      const allTenders = await auctraTender.getAllTenders();
      expect(allTenders.length).to.equal(2);
    });

    it("Should return all bids", async function () {
      const allBids = await auctraTender.getAllBids();
      expect(allBids.length).to.equal(2);
    });

    it("Should return contractor bids", async function () {
      const contractorBids = await auctraTender.getContractorBids(contractor1.address);
      expect(contractorBids.length).to.equal(1);
    });

    it("Should return tender bids", async function () {
      const tenderBids = await auctraTender.getTenderBids(1);
      expect(tenderBids.length).to.equal(2);
    });
  });
});
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var BidService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BidService = void 0;
const common_1 = require("@nestjs/common");
const blockchain_service_1 = require("../blockchain/blockchain.service");
let BidService = BidService_1 = class BidService {
    constructor(blockchainService) {
        this.blockchainService = blockchainService;
        this.logger = new common_1.Logger(BidService_1.name);
    }
    async createBid(createBidDto) {
        try {
            const contract = await this.blockchainService.getContract();
            if (!contract) {
                throw new common_1.BadRequestException('Blockchain contract not available');
            }
            const { tenderId, contractorName, bidAmount, proposal } = createBidDto;
            this.logger.log(`Creating bid for tender ${tenderId} by ${contractorName}`);
            const tx = await contract.submitBid(tenderId, contractorName, bidAmount, proposal);
            const receipt = await tx.wait();
            const event = receipt.logs.find((log) => {
                try {
                    const parsed = contract.interface.parseLog(log);
                    return parsed?.name === 'BidSubmitted';
                }
                catch {
                    return false;
                }
            });
            let bidId = null;
            if (event) {
                const parsedEvent = contract.interface.parseLog(event);
                bidId = parsedEvent?.args?.bidId?.toString();
            }
            this.logger.log(`Bid created successfully with ID: ${bidId}`);
            return {
                success: true,
                bidId,
                transactionHash: receipt.hash,
                blockNumber: receipt.blockNumber,
            };
        }
        catch (error) {
            this.logger.error('Error creating bid:', error);
            throw new common_1.BadRequestException(`Failed to create bid: ${error.message}`);
        }
    }
    async getBid(bidId) {
        try {
            const contract = await this.blockchainService.getContract();
            const bid = await contract.getBid(bidId);
            return {
                id: bid.id.toString(),
                tenderId: bid.tenderId.toString(),
                contractor: bid.contractor,
                contractorName: bid.contractorName,
                bidAmount: bid.bidAmount.toString(),
                proposal: bid.proposal,
                submittedAt: bid.submittedAt.toString(),
                isWithdrawn: bid.isWithdrawn,
            };
        }
        catch (error) {
            this.logger.error('Error getting bid:', error);
            throw new common_1.BadRequestException(`Failed to get bid: ${error.message}`);
        }
    }
    async getAllBids() {
        try {
            const contract = await this.blockchainService.getContract();
            const bidIds = await contract.getAllBids();
            const bids = await Promise.all(bidIds.map(async (id) => {
                try {
                    return await this.getBid(id.toString());
                }
                catch (error) {
                    this.logger.error(`Error fetching bid ${id}:`, error);
                    return null;
                }
            }));
            return bids.filter(bid => bid !== null);
        }
        catch (error) {
            this.logger.error('Error getting all bids:', error);
            throw new common_1.BadRequestException(`Failed to get bids: ${error.message}`);
        }
    }
    async getContractorBids(contractor) {
        try {
            const contract = await this.blockchainService.getContract();
            const bidIds = await contract.getContractorBids(contractor);
            const bids = await Promise.all(bidIds.map(async (bidId) => {
                try {
                    return await this.getBid(bidId.toString());
                }
                catch (error) {
                    this.logger.error(`Error fetching bid ${bidId}:`, error);
                    return null;
                }
            }));
            return bids.filter(bid => bid !== null);
        }
        catch (error) {
            this.logger.error('Error getting contractor bids:', error);
            throw new common_1.BadRequestException(`Failed to get contractor bids: ${error.message}`);
        }
    }
};
exports.BidService = BidService;
exports.BidService = BidService = BidService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [blockchain_service_1.BlockchainService])
], BidService);
//# sourceMappingURL=bid.service.js.map
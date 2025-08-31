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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BidController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const bid_service_1 = require("./bid.service");
const create_bid_dto_1 = require("./dto/create-bid.dto");
let BidController = class BidController {
    constructor(bidService) {
        this.bidService = bidService;
    }
    async createBid(createBidDto) {
        return await this.bidService.createBid(createBidDto);
    }
    async getAllBids() {
        return await this.bidService.getAllBids();
    }
    async getBid(id) {
        return await this.bidService.getBid(id);
    }
    async getContractorBids(address) {
        return await this.bidService.getContractorBids(address);
    }
};
exports.BidController = BidController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Submit a new bid' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Bid submitted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_bid_dto_1.CreateBidDto]),
    __metadata("design:returntype", Promise)
], BidController.prototype, "createBid", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all bids' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of all bids' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BidController.prototype, "getAllBids", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get bid by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bid details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Bid not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BidController.prototype, "getBid", null);
__decorate([
    (0, common_1.Get)('contractor/:address'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all bids by contractor address' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of bids by contractor' }),
    __param(0, (0, common_1.Param)('address')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BidController.prototype, "getContractorBids", null);
exports.BidController = BidController = __decorate([
    (0, swagger_1.ApiTags)('bids'),
    (0, common_1.Controller)('bids'),
    __metadata("design:paramtypes", [bid_service_1.BidService])
], BidController);
//# sourceMappingURL=bid.controller.js.map
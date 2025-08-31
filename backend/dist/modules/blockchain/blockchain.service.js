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
var BlockchainService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockchainService = void 0;
const common_1 = require("@nestjs/common");
const ethers_1 = require("ethers");
const fs = require("fs");
const path = require("path");
let BlockchainService = BlockchainService_1 = class BlockchainService {
    constructor() {
        this.logger = new common_1.Logger(BlockchainService_1.name);
        this.initializeBlockchain();
    }
    async initializeBlockchain() {
        try {
            this.provider = new ethers_1.ethers.JsonRpcProvider('http://localhost:8545');
            const contractPath = path.join(process.cwd(), '../src/contracts/AuctraTender.json');
            if (!fs.existsSync(contractPath)) {
                this.logger.warn('Contract file not found. Please deploy the contract first.');
                return;
            }
            const contractData = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
            try {
                this.logger.log('Signer initialization skipped - will use provider only');
            }
            catch (error) {
                this.logger.warn('No signer available, using provider only');
            }
            this.contract = new ethers_1.ethers.Contract(contractData.address, contractData.abi, this.signer || this.provider);
            this.logger.log('Blockchain service initialized successfully');
        }
        catch (error) {
            this.logger.error('Failed to initialize blockchain service:', error);
        }
    }
    async getContract() {
        if (!this.contract) {
            await this.initializeBlockchain();
        }
        return this.contract;
    }
    async getProvider() {
        return this.provider;
    }
    async getSigner() {
        return this.signer;
    }
    async getBlockNumber() {
        try {
            return await this.provider.getBlockNumber();
        }
        catch (error) {
            this.logger.error('Error getting block number:', error);
            throw new Error('Unable to connect to blockchain');
        }
    }
    async getTransactionReceipt(txHash) {
        try {
            return await this.provider.getTransactionReceipt(txHash);
        }
        catch (error) {
            this.logger.error('Error getting transaction receipt:', error);
            return null;
        }
    }
};
exports.BlockchainService = BlockchainService;
exports.BlockchainService = BlockchainService = BlockchainService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], BlockchainService);
//# sourceMappingURL=blockchain.service.js.map
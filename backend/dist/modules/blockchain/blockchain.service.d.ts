import { ethers } from 'ethers';
export declare class BlockchainService {
    private readonly logger;
    private provider;
    private contract;
    private signer;
    constructor();
    private initializeBlockchain;
    getContract(): Promise<ethers.Contract>;
    getProvider(): Promise<ethers.Provider>;
    getSigner(): Promise<ethers.Signer>;
    getBlockNumber(): Promise<number>;
    getTransactionReceipt(txHash: string): Promise<ethers.TransactionReceipt | null>;
}

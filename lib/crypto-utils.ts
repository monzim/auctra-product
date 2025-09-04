import { ethers } from "ethers";

export interface CompanyKeyPair {
  companyName: string;
  publicKey: string;
  privateKey: string;
  address: string;
  timestamp: string;
}

export interface TransactionData {
  productName: string;
  price: number;
  timestamp: string;
  companyAddress: string;
  previousTransactionHash?: string;
}

export class CryptoService {
  static generateKeyPair(companyName: string): CompanyKeyPair {
    const wallet = ethers.Wallet.createRandom();

    return {
      companyName,
      publicKey: wallet.publicKey,
      privateKey: wallet.privateKey,
      address: wallet.address,
      timestamp: new Date().toISOString(),
    };
  }

  static signTransaction(data: TransactionData, privateKey: string): string {
    // Validate private key format
    if (!privateKey || !privateKey.startsWith('0x') || privateKey.length !== 66) {
      throw new Error('Invalid private key format. Private key must be a 66-character hex string starting with 0x');
    }
    
    try {
      const dataString = JSON.stringify(data);
      const wallet = new ethers.Wallet(privateKey);

      // Create a hash of the data
      const messageHash = ethers.keccak256(ethers.toUtf8Bytes(dataString));

      // Sign the hash
      const signature = wallet.signingKey.sign(messageHash);

      return ethers.Signature.from(signature).serialized;
    } catch (error) {
      throw new Error(`Failed to sign transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static verifySignature(
    data: TransactionData,
    signature: string,
    publicKey: string
  ): boolean {
    try {
      const dataString = JSON.stringify(data);
      const messageHash = ethers.keccak256(ethers.toUtf8Bytes(dataString));

      // Recover the address from the signature
      const recoveredAddress = ethers.recoverAddress(messageHash, signature);

      // Get address from public key
      const expectedAddress = ethers.computeAddress(publicKey);

      return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
    } catch (error) {
      console.error("Signature verification failed:", error);
      return false;
    }
  }

  static generateTransactionHash(
    data: TransactionData,
    signature: string
  ): string {
    const combined = JSON.stringify(data) + signature;
    return ethers.keccak256(ethers.toUtf8Bytes(combined));
  }

  // For demo purposes - pre-generated company keys
  static getPreGeneratedCompanyKeys(): CompanyKeyPair[] {
    return [
      {
        companyName: "TechCorp Solutions",
        publicKey:
          "0x04a1b2c3d4e5f6789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        privateKey:
          "0x1ab42cc412b618bdea3a599e3c9bae199ebf030895b039e9db1e30dafb12b727",
        address: "0x9858EfFD232B4033E47d90003D41EC34EcaEda94",
        timestamp: new Date().toISOString(),
      },
      {
        companyName: "BuildRight Construction",
        publicKey:
          "0x04b2c3d4e5f6789abcdef0123456789abcdef0123456789abcdef0123456789abcdef01234567890abcdef0123456789abcdef0123456789abcdef0",
        privateKey:
          "0x9a983cb3d832fbde5ab49d692b7a8bf5b5d232479c99333d0fc8e1d21f1b55b6",
        address: "0x6Fac4D18c912343BF86fa7049364Dd4E424Ab9C0",
        timestamp: new Date().toISOString(),
      },
    ];
  }
}

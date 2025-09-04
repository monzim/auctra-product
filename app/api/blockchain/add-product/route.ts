import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { BlockchainService } from '@/lib/blockchain-service';
import { CryptoService } from '@/lib/crypto-utils';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      productName, 
      category, 
      description, 
      price, 
      specifications, 
      companyName, 
      privateKey 
    } = body;

    // Get company keys
    const companyKeys = CryptoService.getPreGeneratedCompanyKeys();
    const companyKey = companyKeys.find(k => k.companyName === companyName);
    
    if (!companyKey) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // Ensure company exists in database
    const company = await prisma.company.upsert({
      where: { name: companyName },
      update: {},
      create: {
        name: companyName,
        publicKey: companyKey.publicKey,
        address: companyKey.address,
      }
    });

    // Create transaction data for signing
    const transactionData = {
      productName,
      price: parseFloat(price),
      timestamp: new Date().toISOString(),
      companyAddress: companyKey.address,
    };

    // Sign the transaction
    let signature;
    try {
      signature = CryptoService.signTransaction(transactionData, privateKey);
    } catch (error) {
      console.error('Signature error:', error);
      return NextResponse.json(
        { 
          error: error instanceof Error ? error.message : 'Invalid private key format. Please use the exact private key from your company credentials.',
          details: 'Make sure your private key is a 66-character hex string starting with 0x'
        },
        { status: 400 }
      );
    }

    // Parse specifications safely
    let parsedSpecifications = {};
    try {
      if (typeof specifications === 'string' && specifications.trim() !== '') {
        parsedSpecifications = JSON.parse(specifications);
      } else if (typeof specifications === 'object' && specifications !== null) {
        parsedSpecifications = specifications;
      }
    } catch (error) {
      console.warn('Failed to parse specifications, using empty object:', error);
      parsedSpecifications = {};
    }

    // Prepare blockchain entry
    const blockchainEntry = {
      productName,
      category,
      description,
      price: parseFloat(price),
      specifications: parsedSpecifications,
      companyAddress: companyKey.address,
      timestamp: transactionData.timestamp,
      signature,
    };

    // Initialize blockchain service
    const blockchainService = new BlockchainService();

    // Add to blockchain
    const blockchainResult = await blockchainService.addProductPricing(blockchainEntry);

    // Create product in database
    const product = await prisma.product.create({
      data: {
        name: productName,
        category,
        description,
        specifications: JSON.stringify(blockchainEntry.specifications),
        companyId: company.id,
      }
    });

    // Save price history with blockchain transaction
    const priceHistory = await prisma.productPriceHistory.create({
      data: {
        productId: product.id,
        price: parseFloat(price),
        timestamp: new Date(transactionData.timestamp),
        signature,
        localTransactionHash: blockchainResult.transactionHash,
      }
    });

    // Save blockchain transaction record
    await prisma.blockchainTransaction.create({
      data: {
        companyId: company.id,
        transactionHash: blockchainResult.transactionHash,
        blockHash: blockchainResult.blockHash,
        blockNumber: blockchainResult.blockNumber,
        gasUsed: blockchainResult.gasUsed.toString(),
        status: blockchainResult.status,
        transactionType: 'product_add',
        data: JSON.stringify(blockchainEntry),
      }
    });

    // Sync to public blockchain (mock)
    const publicHash = await blockchainService.syncToPublicBlockchain(blockchainResult.transactionHash);

    // Update price history with public hash
    await prisma.productPriceHistory.update({
      where: { id: priceHistory.id },
      data: { publicTransactionHash: publicHash }
    });

    // Update blockchain transaction with public hash
    await prisma.blockchainTransaction.update({
      where: { transactionHash: blockchainResult.transactionHash },
      data: { publicSyncHash: publicHash }
    });

    return NextResponse.json({
      success: true,
      product: {
        id: product.id,
        name: product.name,
        price: parseFloat(price),
      },
      blockchain: {
        localTransactionHash: blockchainResult.transactionHash,
        publicTransactionHash: publicHash,
        blockNumber: blockchainResult.blockNumber,
        gasUsed: blockchainResult.gasUsed.toString(),
      },
      signature,
    });

  } catch (error) {
    console.error('Add product error:', error);
    return NextResponse.json(
      { error: 'Failed to add product to blockchain' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
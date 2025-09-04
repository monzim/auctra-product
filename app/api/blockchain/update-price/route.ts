import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { BlockchainService } from '@/lib/blockchain-service';
import { CryptoService } from '@/lib/crypto-utils';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      productId, 
      newPrice, 
      companyName, 
      privateKey 
    } = body;

    // Get company keys
    const companyKeys = CryptoService.getPreGeneratedCompanyKeys();
    const companyKey = companyKeys.find(k => k.companyName === companyName);
    
    if (!companyKey) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // Get product and latest price history
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        priceHistory: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        company: true,
      }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Verify company ownership
    if (product.company.name !== companyName) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const latestPriceHistory = product.priceHistory[0];
    const previousTransactionHash = latestPriceHistory?.localTransactionHash;

    // Create transaction data for signing
    const transactionData = {
      productName: product.name,
      price: parseFloat(newPrice),
      timestamp: new Date().toISOString(),
      companyAddress: companyKey.address,
      previousTransactionHash,
    };

    // Sign the transaction
    const signature = CryptoService.signTransaction(transactionData, privateKey);

    // Prepare blockchain entry
    const blockchainEntry = {
      productName: product.name,
      category: product.category,
      description: product.description,
      price: parseFloat(newPrice),
      specifications: JSON.parse(product.specifications),
      companyAddress: companyKey.address,
      timestamp: transactionData.timestamp,
      signature,
      previousTransactionHash,
    };

    // Initialize blockchain service
    const blockchainService = new BlockchainService();

    // Update on blockchain
    const blockchainResult = await blockchainService.updateProductPricing(
      blockchainEntry,
      previousTransactionHash || ''
    );

    // Create new price history entry
    const newPriceHistory = await prisma.productPriceHistory.create({
      data: {
        productId: product.id,
        price: parseFloat(newPrice),
        timestamp: new Date(transactionData.timestamp),
        signature,
        localTransactionHash: blockchainResult.transactionHash,
        previousTransactionId: latestPriceHistory?.id,
      }
    });

    // Save blockchain transaction record
    await prisma.blockchainTransaction.create({
      data: {
        companyId: product.company.id,
        transactionHash: blockchainResult.transactionHash,
        blockHash: blockchainResult.blockHash,
        blockNumber: blockchainResult.blockNumber,
        gasUsed: blockchainResult.gasUsed.toString(),
        status: blockchainResult.status,
        transactionType: 'price_update',
        data: JSON.stringify(blockchainEntry),
      }
    });

    // Sync to public blockchain (mock)
    const publicHash = await blockchainService.syncToPublicBlockchain(blockchainResult.transactionHash);

    // Update price history with public hash
    await prisma.productPriceHistory.update({
      where: { id: newPriceHistory.id },
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
        oldPrice: latestPriceHistory?.price,
        newPrice: parseFloat(newPrice),
      },
      blockchain: {
        localTransactionHash: blockchainResult.transactionHash,
        publicTransactionHash: publicHash,
        blockNumber: blockchainResult.blockNumber,
        gasUsed: blockchainResult.gasUsed.toString(),
        linkedToPrevious: previousTransactionHash,
      },
      signature,
    });

  } catch (error) {
    console.error('Update price error:', error);
    return NextResponse.json(
      { error: 'Failed to update product price on blockchain' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
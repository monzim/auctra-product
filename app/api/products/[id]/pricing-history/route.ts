import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    // Get product with pricing history and blockchain transactions
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            name: true,
            publicKey: true,
            address: true,
          },
        },
        priceHistory: {
          orderBy: { createdAt: "desc" },
          include: {
            previousTransaction: {
              select: {
                id: true,
                localTransactionHash: true,
                price: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Get blockchain transaction details for each price entry
    const blockchainTransactions = await prisma.blockchainTransaction.findMany({
      where: {
        companyId: product.companyId,
        transactionType: { in: ["product_add", "price_update"] },
        data: {
          contains: product.name, // Filter by product name in data
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Format the response
    const formattedHistory = product.priceHistory.map((entry) => {
      const blockchainTx = blockchainTransactions.find(
        (tx) => tx.transactionHash === entry.localTransactionHash
      );

      return {
        id: entry.id,
        price: entry.price,
        timestamp: entry.timestamp,
        signature: entry.signature,
        localTransactionHash: entry.localTransactionHash,
        publicTransactionHash: entry.publicTransactionHash,
        previousTransactionId: entry.previousTransactionId,
        previousTransaction: entry.previousTransaction,
        blockchain: blockchainTx
          ? {
              blockHash: blockchainTx.blockHash,
              blockNumber: blockchainTx.blockNumber,
              gasUsed: blockchainTx.gasUsed,
              status: blockchainTx.status,
              publicSyncHash: blockchainTx.publicSyncHash,
              transactionType: blockchainTx.transactionType,
              createdAt: blockchainTx.createdAt,
            }
          : null,
        createdAt: entry.createdAt,
      };
    });

    return NextResponse.json({
      success: true,
      product: {
        id: product.id,
        name: product.name,
        category: product.category,
        description: product.description,
        specifications: JSON.parse(product.specifications),
        company: product.company,
        currentPrice: product.priceHistory[0]?.price || 0,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      },
      priceHistory: formattedHistory,
      totalEntries: formattedHistory.length,
    });
  } catch (error) {
    console.error("Get pricing history error:", error);
    return NextResponse.json(
      { error: "Failed to fetch pricing history" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

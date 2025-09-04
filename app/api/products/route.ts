import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyName = searchParams.get('companyName');

    let whereClause = {};
    if (companyName) {
      whereClause = {
        company: {
          name: companyName
        }
      };
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        company: {
          select: {
            name: true,
          }
        },
        priceHistory: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.priceHistory[0]?.price || 0,
      vendorName: product.company.name,
      lastUpdated: product.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      products: formattedProducts,
    });

  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const flashSales = await db.flashSale.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(flashSales);
  } catch (error) {
    console.error('Error fetching flash sales:', error);
    return NextResponse.json({ error: 'Failed to fetch flash sales' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const flashSale = await db.flashSale.create({
      data: {
        productId: body.productId,
        discount: body.discount,
        stockLeft: body.stockLeft,
        totalStock: body.totalStock,
        endsAt: body.endsAt,
        isActive: body.isActive !== undefined ? body.isActive : true,
      },
    });

    return NextResponse.json(flashSale, { status: 201 });
  } catch (error) {
    console.error('Error creating flash sale:', error);
    return NextResponse.json({ error: 'Failed to create flash sale' }, { status: 500 });
  }
}

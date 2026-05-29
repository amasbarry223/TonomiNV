import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const promos = await db.promoCode.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(promos);
  } catch (error) {
    console.error('Error fetching promo codes:', error);
    return NextResponse.json({ error: 'Failed to fetch promo codes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const promo = await db.promoCode.create({
      data: {
        code: body.code,
        discount: body.discount,
        type: body.type,
        description: body.description || '',
        minPurchase: body.minPurchase || 0,
        validUntil: body.validUntil,
        isActive: body.isActive !== undefined ? body.isActive : true,
        usageCount: body.usageCount || 0,
      },
    });

    return NextResponse.json(promo, { status: 201 });
  } catch (error) {
    console.error('Error creating promo code:', error);
    return NextResponse.json({ error: 'Failed to create promo code' }, { status: 500 });
  }
}

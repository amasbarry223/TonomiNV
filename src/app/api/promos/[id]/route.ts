import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const promo = await db.promoCode.findUnique({ where: { id } });

    if (!promo) {
      return NextResponse.json({ error: 'Promo code not found' }, { status: 404 });
    }

    return NextResponse.json(promo);
  } catch (error) {
    console.error('Error fetching promo code:', error);
    return NextResponse.json({ error: 'Failed to fetch promo code' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const promo = await db.promoCode.update({
      where: { id },
      data: {
        ...(body.code !== undefined && { code: body.code }),
        ...(body.discount !== undefined && { discount: body.discount }),
        ...(body.type !== undefined && { type: body.type }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.minPurchase !== undefined && { minPurchase: body.minPurchase }),
        ...(body.validUntil !== undefined && { validUntil: body.validUntil }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        ...(body.usageCount !== undefined && { usageCount: body.usageCount }),
      },
    });

    return NextResponse.json(promo);
  } catch (error) {
    console.error('Error updating promo code:', error);
    return NextResponse.json({ error: 'Failed to update promo code' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.promoCode.delete({ where: { id } });
    return NextResponse.json({ message: 'Promo code deleted successfully' });
  } catch (error) {
    console.error('Error deleting promo code:', error);
    return NextResponse.json({ error: 'Failed to delete promo code' }, { status: 500 });
  }
}

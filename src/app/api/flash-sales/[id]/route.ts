import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const flashSale = await db.flashSale.update({
      where: { id },
      data: {
        ...(body.productId !== undefined && { productId: body.productId }),
        ...(body.discount !== undefined && { discount: body.discount }),
        ...(body.stockLeft !== undefined && { stockLeft: body.stockLeft }),
        ...(body.totalStock !== undefined && { totalStock: body.totalStock }),
        ...(body.endsAt !== undefined && { endsAt: body.endsAt }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
      },
    });

    return NextResponse.json(flashSale);
  } catch (error) {
    console.error('Error updating flash sale:', error);
    return NextResponse.json({ error: 'Failed to update flash sale' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.flashSale.delete({ where: { id } });
    return NextResponse.json({ message: 'Flash sale deleted successfully' });
  } catch (error) {
    console.error('Error deleting flash sale:', error);
    return NextResponse.json({ error: 'Failed to delete flash sale' }, { status: 500 });
  }
}

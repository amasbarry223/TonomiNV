import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { material: { contains: search } },
      ];
    }

    if (category) {
      where.category = category;
    }

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      db.product.count({ where }),
    ]);

    const formatted = products.map((p) => ({
      ...p,
      colors: p.colors ? p.colors.split(',') : [],
      sizes: p.sizes ? p.sizes.split(',') : [],
      images: p.images ? p.images.split(',') : [],
    }));

    return NextResponse.json({
      products: formatted,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const product = await db.product.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description || '',
        price: body.price,
        pricePromo: body.pricePromo || null,
        category: body.category,
        colors: Array.isArray(body.colors) ? body.colors.join(',') : (body.colors || ''),
        sizes: Array.isArray(body.sizes) ? body.sizes.join(',') : (body.sizes || ''),
        images: Array.isArray(body.images) ? body.images.join(',') : (body.images || ''),
        stock: body.stock || 0,
        rating: body.rating || 0,
        reviewCount: body.reviewCount || 0,
        badge: body.badge || null,
        isNew: body.isNew || false,
        isBestSeller: body.isBestSeller || false,
        material: body.material || '',
      },
    });

    return NextResponse.json({
      ...product,
      colors: product.colors ? product.colors.split(',') : [],
      sizes: product.sizes ? product.sizes.split(',') : [],
      images: product.images ? product.images.split(',') : [],
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

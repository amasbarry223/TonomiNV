import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Total counts
    const [totalProducts, totalCategories, totalOrders, deliveredOrders, unreadMessages, subscriberCount] = await Promise.all([
      db.product.count(),
      db.category.count(),
      db.order.count(),
      db.order.findMany({ where: { status: 'delivered' }, select: { total: true } }),
      db.contactMessage.count({ where: { isRead: false } }),
      db.newsletterSubscriber.count(),
    ]);

    const totalRevenue = deliveredOrders.reduce((sum, o) => sum + o.total, 0);

    // Orders by status
    const [pending, confirmed, shipped, delivered, cancelled] = await Promise.all([
      db.order.count({ where: { status: 'pending' } }),
      db.order.count({ where: { status: 'confirmed' } }),
      db.order.count({ where: { status: 'shipped' } }),
      db.order.count({ where: { status: 'delivered' } }),
      db.order.count({ where: { status: 'cancelled' } }),
    ]);

    // Recent orders
    const recentOrders = await db.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });

    // Top products by sales (from order items)
    const orderItems = await db.orderItem.findMany({
      select: { productId: true, productName: true, quantity: true },
    });

    const productSalesMap = new Map<string, { name: string; totalSold: number }>();
    for (const item of orderItems) {
      const existing = productSalesMap.get(item.productId);
      if (existing) {
        existing.totalSold += item.quantity;
      } else {
        productSalesMap.set(item.productId, { name: item.productName, totalSold: item.quantity });
      }
    }

    const topProducts = Array.from(productSalesMap.entries())
      .map(([productId, data]) => ({ productId, ...data }))
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 5);

    // Monthly revenue (last 6 months)
    const now = new Date();
    const monthlyRevenue = [];
    for (let i = 5; i >= 0; i--) {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      const monthOrders = await db.order.findMany({
        where: {
          status: 'delivered',
          createdAt: { gte: startOfMonth, lte: endOfMonth },
        },
        select: { total: true },
      });
      const revenue = monthOrders.reduce((sum, o) => sum + o.total, 0);
      monthlyRevenue.push({
        month: startOfMonth.toLocaleString('fr-FR', { month: 'short', year: 'numeric' }),
        revenue,
      });
    }

    return NextResponse.json({
      totalProducts,
      totalCategories,
      totalOrders,
      totalRevenue,
      ordersByStatus: { pending, confirmed, shipped, delivered, cancelled },
      recentOrders,
      topProducts,
      monthlyRevenue,
      unreadMessages,
      subscriberCount,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}

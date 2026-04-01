import { Types } from 'mongoose';
import { Order } from '../Order/order.model';
import { Product } from '../Product/product.model';
import { ActivityLog } from '../ActivityLog/activityLog.model';

const getDashboardStatsFromDB = async (userId: string) => {
  const userObjectId = new Types.ObjectId(userId);
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const startOf7DaysAgo = new Date();
  startOf7DaysAgo.setDate(startOf7DaysAgo.getDate() - 6);
  startOf7DaysAgo.setHours(0, 0, 0, 0);

  const [ordersTodayStats, orderStatusCounts, lowStockCount, productsList, recentLogDocs, chartAggregation, totalActiveProducts] = await Promise.all([
    Order.aggregate([
      {
        $match: {
          userId: userObjectId,
          createdAt: { $gte: startOfToday, $lte: endOfToday },
          isDeleted: false
        }
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          revenue: {
            $sum: { $cond: [{ $ne: ['$status', 'Cancelled'] }, '$totalPrice', 0] }
          }
        }
      }
    ]),

    Order.aggregate([
      { $match: { userId: userObjectId, isDeleted: false } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]),

    Product.countDocuments({
      userId,
      isDeleted: false,
      $expr: { $lt: ['$stockQuantity', '$minimumStockThreshold'] }
    }),

    Product.find({ userId, isDeleted: false }).sort({ stockQuantity: 1 }).limit(10),

    ActivityLog.find({ userId }).sort('-createdAt').limit(5),

    Order.aggregate([
      {
        $match: {
          userId: userObjectId,
          createdAt: { $gte: startOf7DaysAgo, $lte: endOfToday },
          isDeleted: false
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 },
          revenue: {
            $sum: { $cond: [{ $ne: ['$status', 'Cancelled'] }, '$totalPrice', 0] }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]),
    Product.countDocuments({ userId, isDeleted: false })
  ]);

  const totalOrdersToday = ordersTodayStats.length > 0 ? ordersTodayStats[0].totalOrders : 0;
  const revenueToday = ordersTodayStats.length > 0 ? Number(ordersTodayStats[0].revenue.toFixed(2)) : 0;

  const pendingVsCompleted = orderStatusCounts.reduce((acc, curr) => {
    acc[curr._id] = curr.count;
    return acc;
  }, {} as Record<string, number>);

  const productSummary = productsList.map(product => {
    let statusText = 'OK';
    let suffix = 'available';

    if (product.stockQuantity === 0) {
      statusText = 'Out of Stock';
      suffix = 'left';
    } else if (product.stockQuantity < product.minimumStockThreshold) {
      statusText = 'Low Stock';
      suffix = 'left';
    }

    return `${product.name} — ${product.stockQuantity} ${suffix} (${statusText})`;
  });

  const recentActivities = recentLogDocs.map(log => {
    const timeString = (log as any).createdAt?.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) || 'Just now';
    return `${timeString} — ${log.message}`;
  });

  const chartData = [];
  for (let i = 6; i >= 0; i--) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - i);

    const dateStr = targetDate.toISOString().split('T')[0];
    const existingData = chartAggregation.find(item => item._id === dateStr);

    chartData.push({
      date: dateStr,
      revenue: existingData ? Number(existingData.revenue.toFixed(2)) : 0,
      orders: existingData ? existingData.orders : 0
    });
  }

  return {
    totalOrdersToday,
    revenueToday,
    pendingVsCompleted,
    lowStockItemsCount: lowStockCount,
    totalProductsCount: totalActiveProducts,
    productSummary,
    recentActivities,
    chartData
  };
};

export const DashboardServices = {
  getDashboardStatsFromDB,
};

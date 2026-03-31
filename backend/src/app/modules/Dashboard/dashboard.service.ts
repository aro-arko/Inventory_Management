import { Order } from '../Order/order.model';
import { Product } from '../Product/product.model';
import { ActivityLog } from '../ActivityLog/activityLog.model';

const getDashboardStatsFromDB = async () => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const [ordersTodayStats, orderStatusCounts, lowStockCount, productsList, recentLogDocs] = await Promise.all([
    Order.aggregate([
      {
        $match: {
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
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]),

    Product.countDocuments({
      isDeleted: false,
      $expr: { $lt: ['$stockQuantity', '$minimumStockThreshold'] }
    }),

    Product.find({ isDeleted: false }).sort({ stockQuantity: 1 }).limit(10),

    ActivityLog.find().sort('-createdAt').limit(10)
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
      // Standardizes time explicitly like 10:15 AM
      const timeString = (log as any).createdAt?.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) || 'Just now';
      return `${timeString} — ${log.message}`;
  });

  return {
    totalOrdersToday,
    revenueToday,
    pendingVsCompleted,
    lowStockItemsCount: lowStockCount,
    productSummary,
    recentActivities
  };
};

export const DashboardServices = {
  getDashboardStatsFromDB,
};

import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Product } from '../Product/product.model';
import { TOrder } from './order.interface';
import { Order } from './order.model';
import { ActivityLogService } from '../ActivityLog/activityLog.service';
import QueryBuilder from '../../builder/QueryBuilder';


const createOrderIntoDB = async (userId: string, payload: Partial<TOrder>) => {
  const { customerName, products, status } = payload;

  if (!products || products.length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Order must contain at least one product');
  }

  let calculatedTotalPrice = 0;
  const productDocs = [];
  const processedProducts = new Set();

  for (const item of products) {
    const productIdStr = item.product.toString();
    if (processedProducts.has(productIdStr)) {
      throw new AppError(httpStatus.BAD_REQUEST, 'This product is already added to the order.');
    }
    processedProducts.add(productIdStr);

    const productItem = await Product.findOne({ _id: item.product, userId });
    if (!productItem) {
      throw new AppError(httpStatus.NOT_FOUND, `Product with ID ${item.product} not found`);
    }

    if (productItem.status !== 'Active') {
      throw new AppError(httpStatus.BAD_REQUEST, 'This product is currently unavailable.');
    }

    if (item.quantity <= 0) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Product quantity must be greater than zero');
    }

    if (item.quantity > productItem.stockQuantity) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Only ${productItem.stockQuantity} items available in stock for ${productItem.name}.`
      );
    }

    calculatedTotalPrice += productItem.price * item.quantity;
    productDocs.push({
      doc: productItem,
      requestedQuantity: item.quantity
    });
  }

  for (const item of productDocs) {
    const dropsBelowThreshold = item.doc.stockQuantity >= item.doc.minimumStockThreshold && (item.doc.stockQuantity - item.requestedQuantity) < item.doc.minimumStockThreshold;

    item.doc.stockQuantity -= item.requestedQuantity;
    if (item.doc.stockQuantity === 0) {
      item.doc.status = 'Out of Stock';
    }
    await item.doc.save();

    if (dropsBelowThreshold) {
      ActivityLogService.logAction(userId, `Product "${item.doc.name}" added to Restock Queue`);
    }
  }

  const result = await Order.create({
    userId,
    customerName,
    products,
    totalPrice: calculatedTotalPrice,
    status: status || 'Pending',
  });

  ActivityLogService.logAction(userId, `Order #${result._id.toString().slice(-4)} created by user`);

  return result;
};

const updateOrderStatusInDB = async (userId: string, id: string, status: string) => {
  if (status === 'Cancelled') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Please use the cancel order endpoint to cancel an order and restore stock');
  }

  const order = await Order.findOne({ _id: id, userId });
  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
  }

  if (order.status === 'Cancelled' && status !== 'Cancelled') {
    const productDocs = [];

    for (const item of order.products) {
      const productItem = await Product.findOne({ _id: item.product, userId });
      if (!productItem) {
        throw new AppError(httpStatus.NOT_FOUND, `Product with ID ${item.product} not found`);
      }

      if (productItem.status !== 'Active') {
        throw new AppError(httpStatus.BAD_REQUEST, 'This product is currently unavailable.');
      }

      if (item.quantity > productItem.stockQuantity) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `Cannot reactivate order. Only ${productItem.stockQuantity} items available in stock for ${productItem.name}.`
        );
      }
      productDocs.push({
        doc: productItem,
        requestedQuantity: item.quantity
      });
    }

    for (const item of productDocs) {
      item.doc.stockQuantity -= item.requestedQuantity;
      if (item.doc.stockQuantity === 0) {
        item.doc.status = 'Out of Stock';
      }
      await item.doc.save();
    }
  }

  order.status = status as 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  await order.save();

  ActivityLogService.logAction(userId, `Order #${order._id.toString().slice(-4)} marked as ${status}`);

  return order;
};

const cancelOrderInDB = async (userId: string, id: string) => {
  const order = await Order.findOne({ _id: id, userId });

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
  }

  if (order.status === 'Cancelled') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Order is already cancelled');
  }

  for (const item of order.products) {
    const productItem = await Product.findOne({ _id: item.product, userId });
    if (productItem) {
      productItem.stockQuantity += item.quantity;
      if (productItem.status === 'Out of Stock' && productItem.stockQuantity > 0) {
        productItem.status = 'Active';
      }
      await productItem.save();
    }
  }

  order.status = 'Cancelled';
  await order.save();

  ActivityLogService.logAction(userId, `Order #${order._id.toString().slice(-4)} cancelled`);

  return order;
};


const getAllOrdersFromDB = async (userId: string, query: Record<string, unknown>) => {
  const baseFilter: Record<string, unknown> = { userId, isDeleted: false };

  if (query.date && typeof query.date === 'string') {
    const startDate = new Date(query.date);
    const endDate = new Date(query.date);
    endDate.setUTCHours(23, 59, 59, 999);
    baseFilter.createdAt = {
      $gte: startDate,
      $lte: endDate,
    };
    delete query.date;
  }

  const orderQuery = new QueryBuilder(
    Order.find(baseFilter).populate('products.product'),
    query
  )
    .search(['customerName'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await orderQuery.modelQuery;
  const meta = await orderQuery.countTotal();

  return { meta, result };
};

const getOrderDetailsFromDB = async (userId: string, id: string) => {
  const order = await Order.findOne({ _id: id, userId, isDeleted: false }).populate('products.product');

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
  }

  return order;
};

export const OrderServices = {
  createOrderIntoDB,
  updateOrderStatusInDB,
  cancelOrderInDB,
  getAllOrdersFromDB,
  getOrderDetailsFromDB,
};

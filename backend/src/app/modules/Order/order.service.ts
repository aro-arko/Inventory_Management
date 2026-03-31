import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Product } from '../Product/product.model';
import { TOrder } from './order.interface';
import { Order } from './order.model';

const createOrderIntoDB = async (payload: Partial<TOrder>) => {
  const { customerName, products, status } = payload;

  if (!products || products.length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Order must contain at least one product');
  }

  let calculatedTotalPrice = 0;

  // Validate products and calculate total price
  for (const item of products) {
    const productItem = await Product.findById(item.product);
    if (!productItem) {
      throw new AppError(httpStatus.NOT_FOUND, `Product with ID ${item.product} not found`);
    }

    if (item.quantity <= 0) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Product quantity must be greater than zero');
    }

    calculatedTotalPrice += productItem.price * item.quantity;
  }

  const result = await Order.create({
    customerName,
    products,
    totalPrice: calculatedTotalPrice,
    status: status || 'Pending',
  });

  return result;
};

const updateOrderStatusInDB = async (id: string, status: string) => {
  const result = await Order.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
  }
  return result;
};

const cancelOrderInDB = async (id: string) => {
  const result = await Order.findByIdAndUpdate(
    id,
    { status: 'Cancelled' },
    { new: true, runValidators: true }
  );
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
  }
  return result;
};

const getAllOrdersFromDB = async (query: Record<string, unknown>) => {
  const filter: Record<string, unknown> = { isDeleted: false };
  
  if (query.status) {
    filter.status = query.status;
  }

  // Handle date formatting if provided (assuming query.date is "YYYY-MM-DD")
  if (query.date && typeof query.date === 'string') {
    const startDate = new Date(query.date);
    const endDate = new Date(query.date);
    endDate.setUTCHours(23, 59, 59, 999);
    filter.createdAt = {
      $gte: startDate,
      $lte: endDate,
    };
  }

  const result = await Order.find(filter)
    .populate('products.product')
    .sort('-createdAt');
    
  return result;
};

export const OrderServices = {
  createOrderIntoDB,
  updateOrderStatusInDB,
  cancelOrderInDB,
  getAllOrdersFromDB,
};

import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TProduct } from './product.interface';
import { Product } from './product.model';

const createProductIntoDB = async (payload: TProduct) => {
  const result = await Product.create(payload);
  return result;
};

const getAllProductsFromDB = async () => {
  const result = await Product.find({ isDeleted: false }).populate('category');
  return result;
};

const getRestockQueueFromDB = async () => {
  const products = await Product.find({
    isDeleted: false,
    $expr: { $lt: ['$stockQuantity', '$minimumStockThreshold'] }
  })
    .sort({ stockQuantity: 1 })
    .populate('category');

  // Map to inject priority
  const queue = products.map((product) => {
    let priority = 'Low';
    
    if (product.stockQuantity === 0) {
      priority = 'High';
    } else if (product.stockQuantity <= product.minimumStockThreshold / 2) {
      priority = 'Medium';
    }

    return {
      ...(product.toObject ? product.toObject() : product),
      priority,
    };
  });

  return queue;
};

const restockProductInDB = async (id: string, quantityToAdd: number) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }

  product.stockQuantity += quantityToAdd;
  
  if (product.stockQuantity > 0 && product.status === 'Out of Stock') {
    product.status = 'Active';
  }

  await product.save();
  return product;
};

export const ProductServices = {
  createProductIntoDB,
  getAllProductsFromDB,
  getRestockQueueFromDB,
  restockProductInDB,
};

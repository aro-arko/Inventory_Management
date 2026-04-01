import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TProduct } from './product.interface';
import { Product } from './product.model';
import { ActivityLogService } from '../ActivityLog/activityLog.service';
import QueryBuilder from '../../builder/QueryBuilder';

const createProductIntoDB = async (payload: TProduct) => {
  const result = await Product.create(payload);
  ActivityLogService.logAction(payload.userId, `Product "${payload.name}" created`);
  return result;
};


const getAllProductsFromDB = async (userId: string, query: Record<string, unknown>) => {
  const productQuery = new QueryBuilder(
    Product.find({ userId, isDeleted: false }).populate('category'),
    query
  )
    .search(['name'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await productQuery.modelQuery;
  const meta = await productQuery.countTotal();

  return { meta, result };
};

const updateProductInDB = async (userId: string, id: string, payload: Partial<TProduct>) => {
  const product = await Product.findOne({ _id: id, userId, isDeleted: false });

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }

  const updatedProduct = await Product.findOneAndUpdate(
    { _id: id, userId },
    payload,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedProduct) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }

  ActivityLogService.logAction(userId, `Product "${updatedProduct.name}" updated`);

  return updatedProduct;
};

const getRestockQueueFromDB = async (userId: string) => {
  const products = await Product.find({
    userId,
    isDeleted: false,
    $expr: { $lt: ['$stockQuantity', '$minimumStockThreshold'] }
  })
    .sort({ stockQuantity: 1 })
    .populate('category');

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

const restockProductInDB = async (userId: string, id: string, quantityToAdd: number) => {
  const product = await Product.findOne({ _id: id, userId });

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }

  product.stockQuantity += quantityToAdd;

  if (product.stockQuantity > 0 && product.status === 'Out of Stock') {
    product.status = 'Active';
  }

  await product.save();

  ActivityLogService.logAction(userId, `Stock updated for "${product.name}"`);

  return product;
};

export const ProductServices = {
  createProductIntoDB,
  getAllProductsFromDB,
  updateProductInDB,
  getRestockQueueFromDB,
  restockProductInDB,
};

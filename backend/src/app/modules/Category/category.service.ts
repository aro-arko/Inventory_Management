import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { ActivityLogService } from '../ActivityLog/activityLog.service';
import { Product } from '../Product/product.model';
import { TCategory } from './category.interface';
import { Category } from './category.model';

const createCategoryIntoDB = async (payload: TCategory) => {
  const result = await Category.create(payload);
  ActivityLogService.logAction(payload.userId, `Category "${payload.name}" created`);
  return result;
};

const getAllCategoriesFromDB = async (userId: string) => {
  const result = await Category.find({ userId, isDeleted: false });
  return result;
};

const updateCategoryInDB = async (userId: string, id: string, payload: Partial<TCategory>) => {
  const category = await Category.findOne({ _id: id, userId, isDeleted: false });

  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
  }

  if (payload.isDeleted === true) {
    const isCategoryInUse = await Product.exists({
      category: category._id,
      userId,
      isDeleted: false,
    });

    if (isCategoryInUse) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Category is in use by existing products and cannot be deleted',
      );
    }
  }

  const updatedCategory = await Category.findOneAndUpdate(
    { _id: id, userId },
    payload,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedCategory) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
  }

  ActivityLogService.logAction(userId, `Category "${updatedCategory.name}" updated`);

  return updatedCategory;
};

export const CategoryServices = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
  updateCategoryInDB,
};

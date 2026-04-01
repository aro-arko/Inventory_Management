import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ProductServices } from './product.service';

const createProduct = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await ProductServices.createProductIntoDB({
    ...req.body,
    userId,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Product created successfully',
    data: result,
  });
});

const getAllProducts = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await ProductServices.getAllProductsFromDB(userId, req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Products retrieved successfully',
    data: result,
  });
});

const updateProduct = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const id = req.params.id as string;
  const result = await ProductServices.updateProductInDB(userId, id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product updated successfully',
    data: result,
  });
});

const getRestockQueue = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await ProductServices.getRestockQueueFromDB(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Restock queue retrieved successfully',
    data: result,
  });
});

const restockProduct = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const id = req.params.id as string;
  const { quantityToAdd } = req.body;
  const result = await ProductServices.restockProductInDB(userId, id, quantityToAdd);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product restocked successfully',
    data: result,
  });
});

export const ProductControllers = {
  createProduct,
  getAllProducts,
  updateProduct,
  getRestockQueue,
  restockProduct,
};

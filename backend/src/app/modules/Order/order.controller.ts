import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { OrderServices } from './order.service';

const createOrder = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await OrderServices.createOrderIntoDB(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Order created successfully',
    data: result,
  });
});

const updateOrderStatus = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const id = req.params.id as string;
  const { status } = req.body;
  const result = await OrderServices.updateOrderStatusInDB(userId, id, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order status updated successfully',
    data: result,
  });
});

const cancelOrder = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const id = req.params.id as string;
  const result = await OrderServices.cancelOrderInDB(userId, id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order cancelled successfully',
    data: result,
  });
});

const getAllOrders = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await OrderServices.getAllOrdersFromDB(userId, req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Orders retrieved successfully',
    data: result,
  });
});

const getOrderDetails = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const id = req.params.id as string;
  const result = await OrderServices.getOrderDetailsFromDB(userId, id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order details retrieved successfully',
    data: result,
  });
});

export const OrderControllers = {
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
  getOrderDetails,
};

import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DashboardServices } from './dashboard.service';

const getDashboardStats = catchAsync(async (req, res) => {
  const result = await DashboardServices.getDashboardStatsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Dashboard metrics retrieved successfully',
    data: result,
  });
});

export const DashboardControllers = {
  getDashboardStats,
};

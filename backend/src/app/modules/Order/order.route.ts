import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { OrderValidations } from './order.validation';
import { OrderControllers } from './order.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.manager),
  validateRequest(OrderValidations.createOrderValidationSchema),
  OrderControllers.createOrder,
);

router.get('/', auth(USER_ROLE.admin, USER_ROLE.manager), OrderControllers.getAllOrders);

router.get('/:id', auth(USER_ROLE.admin, USER_ROLE.manager), OrderControllers.getOrderDetails);

router.patch(
  '/:id/status',
  auth(USER_ROLE.admin, USER_ROLE.manager),
  validateRequest(OrderValidations.updateOrderStatusValidationSchema),
  OrderControllers.updateOrderStatus,
);

router.patch(
  '/:id/cancel',
  auth(USER_ROLE.admin, USER_ROLE.manager),
  OrderControllers.cancelOrder,
);

export const OrderRoutes = router;

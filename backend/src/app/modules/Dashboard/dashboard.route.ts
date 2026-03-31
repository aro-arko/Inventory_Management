import express from 'express';
import { DashboardControllers } from './dashboard.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.manager),
  DashboardControllers.getDashboardStats,
);

export const DashboardRoutes = router;

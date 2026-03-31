import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { authValidation } from './auth.validation';
import { authController } from './auth.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

// register
router.post(
  '/register',
  validateRequest(authValidation.registerValidation),
  authController.registerUser,
);

// login
router.post(
  '/login',
  validateRequest(authValidation.loginValidation),
  authController.loginUser,
);

// change password
router.patch(
  '/change-password',
  auth(USER_ROLE.admin, USER_ROLE.manager),
  validateRequest(authValidation.changePasswordValidation),
  authController.changePassword,
);

export const AuthRoutes = router;
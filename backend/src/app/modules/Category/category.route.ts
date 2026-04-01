import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CategoryValidations } from './category.validation';
import { CategoryControllers } from './category.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.manager),
  validateRequest(CategoryValidations.createCategoryValidationSchema),
  CategoryControllers.createCategory,
);

router.get('/', auth(USER_ROLE.admin, USER_ROLE.manager), CategoryControllers.getAllCategories);

router.patch('/:id', auth(USER_ROLE.admin, USER_ROLE.manager), validateRequest(CategoryValidations.updateCategoryValidationSchema), CategoryControllers.updateCategory);

export const CategoryRoutes = router;

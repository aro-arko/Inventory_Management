import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ProductValidations } from './product.validation';
import { ProductControllers } from './product.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.manager),
  validateRequest(ProductValidations.createProductValidationSchema),
  ProductControllers.createProduct,
);

router.get('/', auth(USER_ROLE.admin, USER_ROLE.manager), ProductControllers.getAllProducts);

router.patch('/:id', auth(USER_ROLE.admin, USER_ROLE.manager), validateRequest(ProductValidations.updateProductValidationSchema), ProductControllers.updateProduct);

router.get('/restock-queue', auth(USER_ROLE.admin, USER_ROLE.manager), ProductControllers.getRestockQueue);

router.patch(
  '/:id/restock',
  auth(USER_ROLE.admin, USER_ROLE.manager),
  validateRequest(ProductValidations.restockValidationSchema),
  ProductControllers.restockProduct,
);

export const ProductRoutes = router;

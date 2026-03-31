import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { CategoryRoutes } from '../modules/Category/category.route';
import { ProductRoutes } from '../modules/Product/product.route';
import { OrderRoutes } from '../modules/Order/order.route';
import { DashboardRoutes } from '../modules/Dashboard/dashboard.route';

const router = Router();

const moduleRoutes = [
    {
        path: '/auth',
        route: AuthRoutes,
    },
    {
        path: '/categories',
        route: CategoryRoutes,
    },
    {
        path: '/products',
        route: ProductRoutes,
    },
    {
        path: '/orders',
        route: OrderRoutes,
    },
    {
        path: '/dashboard',
        route: DashboardRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
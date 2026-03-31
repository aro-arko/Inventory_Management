import { z } from 'zod';
import { Types } from 'mongoose';

const orderProductValidationSchema = z.object({
  product: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: 'Invalid Product ID',
  }),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

const createOrderValidationSchema = z.object({
  body: z.object({
    customerName: z.string().min(1, 'Customer name is required'),
    products: z
      .array(orderProductValidationSchema)
      .min(1, 'An order must contain at least one product.'),
    status: z.enum(['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled']).optional(),
  }),
});

const updateOrderStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled']),
  }),
});

export const OrderValidations = {
  createOrderValidationSchema,
  updateOrderStatusValidationSchema,
};

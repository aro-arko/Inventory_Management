import { z } from 'zod';
import { Types } from 'mongoose';

const createProductValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Product name is required'),
    category: z.string().refine((val) => {
      return Types.ObjectId.isValid(val);
    }, { message: 'Invalid Category ID' }),
    price: z.number().min(0, 'Price must be a positive number'),
    stockQuantity: z.number().min(0, 'Stock quantity cannot be negative'),
    minimumStockThreshold: z.number().min(0, 'Minimum stock threshold cannot be negative'),
    status: z.enum(['Active', 'Out of Stock']),
  }),
});

export const ProductValidations = {
  createProductValidationSchema,
};

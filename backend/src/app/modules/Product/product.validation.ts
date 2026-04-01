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

const restockValidationSchema = z.object({
  body: z.object({
    quantityToAdd: z.number().int().positive('Quantity to add must be a positive integer'),
  }),
});

const updateProductValidationSchema = z.object({
  body: z
    .object({
      name: z.string().min(1, 'Product name is required').optional(),
      category: z
        .string()
        .refine((val) => {
          return Types.ObjectId.isValid(val);
        }, { message: 'Invalid Category ID' })
        .optional(),
      price: z.number().min(0, 'Price must be a positive number').optional(),
      stockQuantity: z.number().min(0, 'Stock quantity cannot be negative').optional(),
      minimumStockThreshold: z.number().min(0, 'Minimum stock threshold cannot be negative').optional(),
      status: z.enum(['Active', 'Out of Stock']).optional(),
      isDeleted: z.boolean().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field is required to update product',
    }),
});

export const ProductValidations = {
  createProductValidationSchema,
  restockValidationSchema,
  updateProductValidationSchema,
};

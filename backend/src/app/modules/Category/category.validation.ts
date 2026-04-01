import { z } from 'zod';

const createCategoryValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Category name is required'),
  }),
});

const updateCategoryValidationSchema = z.object({
  body: z
    .object({
      name: z.string().min(1, 'Category name is required').optional(),
      isDeleted: z.boolean().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field is required to update category',
    }),
});

export const CategoryValidations = {
  createCategoryValidationSchema,
  updateCategoryValidationSchema,
};

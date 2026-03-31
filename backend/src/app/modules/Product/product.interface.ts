import { Types } from 'mongoose';

export type TProduct = {
  name: string;
  category: Types.ObjectId;
  price: number;
  stockQuantity: number;
  minimumStockThreshold: number;
  status: 'Active' | 'Out of Stock';
  isDeleted?: boolean;
};

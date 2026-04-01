import { Types } from 'mongoose';

export type TOrderProduct = {
  product: Types.ObjectId;
  quantity: number;
};

export type TOrder = {
  userId: Types.ObjectId;
  customerName: string;
  products: TOrderProduct[];
  totalPrice: number;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  isDeleted?: boolean;
};

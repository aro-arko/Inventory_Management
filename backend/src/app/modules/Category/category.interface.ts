import { Types } from 'mongoose';

export type TCategory = {
  userId: Types.ObjectId;
  name: string;
  isDeleted?: boolean;
};

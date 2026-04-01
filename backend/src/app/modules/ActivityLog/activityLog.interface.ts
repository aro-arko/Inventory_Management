import { Types } from 'mongoose';

export type TActivityLog = {
  userId: Types.ObjectId;
  message: string;
};

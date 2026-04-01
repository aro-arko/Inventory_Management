import { model, Schema } from 'mongoose';
import { TActivityLog } from './activityLog.interface';

const activityLogSchema = new Schema<TActivityLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const ActivityLog = model<TActivityLog>('ActivityLog', activityLogSchema);

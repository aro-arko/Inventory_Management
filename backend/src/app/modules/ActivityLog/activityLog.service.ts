import { ActivityLog } from './activityLog.model';

const logAction = async (userId: any, message: string) => {
  try {
    await ActivityLog.create({ userId, message });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};

export const ActivityLogService = {
  logAction,
};

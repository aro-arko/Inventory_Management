import { ActivityLog } from './activityLog.model';

const logAction = async (message: string) => {
  try {
    await ActivityLog.create({ message });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};

export const ActivityLogService = {
  logAction,
};

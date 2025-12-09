export enum NotificationPriority {
  Critical = 'Critical',
  Warning = 'Warning',
  Info = 'Info',
}

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  priority: NotificationPriority;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}
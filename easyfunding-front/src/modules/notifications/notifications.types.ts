export type NotificationStatus = "pending" | "sent" | "failed";

export type NotificationType =
  | "SYSTEM"
  | "INFO"
  | "WARNING"
  | "ALERT";

export type AppNotification = {
  id: number;
  title: string;
  source: string;
  message: string;
  created_at: string;
  type: NotificationType;
  status: NotificationStatus;
  viewed: boolean;
  data?: Record<string, any> | null;
};

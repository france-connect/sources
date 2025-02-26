export interface NotificationConfig extends Record<string, string | string[]> {
  message: string;
  startDate: string;
  stopDate: string;
  isActive: 'true' | 'false';
}

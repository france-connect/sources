import { Document } from 'mongoose';

export interface NotificationInterface extends Document {
  message: string;
  startDate: Date;
  stopDate: Date;
  isActive: boolean;
}

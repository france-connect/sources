import { Document } from 'mongoose';

export interface INotifications extends Document {
  message: string;
}

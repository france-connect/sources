/* istanbul ignore file */

// Declarative code
import * as mongoose from 'mongoose';

export const NotificationsSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    startDate: { type: Date, required: true },
    stopDate: { type: Date, required: true },
    isActive: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    // Mongoose add 's' at the end of the collection name without this argument
    collection: 'notifications',
    strict: true,
    timestamps: true,
  },
);

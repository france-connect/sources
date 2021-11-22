/* istanbul ignore file */

import * as mongoose from 'mongoose';

export const MinistriesSchema = new mongoose.Schema(
  {
    id: { type: String },
    name: { type: String },
    sort: { type: Number },
    identityProviders: { type: Array },
  },
  {
    // Mongoose add 's' at the end of the collection name without this argument
    collection: 'ministries',
    strict: true,
  },
);

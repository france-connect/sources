import { Document, Schema as SchemaNative } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { IFederation } from '../interfaces';

@Schema({
  strict: true,
  collection: 'account',
  timestamps: true,
})
export class Account extends Document {
  /**
   * Timestamping
   */
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: String })
  id: string;

  @Prop({ type: Date, default: Date.now, index: { expires: '3y' } })
  updatedAt: Date;

  @Prop({ type: Date, default: Date.now })
  lastConnection: Date;

  /**
   * Unique id generated from pivot identity
   */
  @Prop({ type: String, unique: true })
  identityHash: string;

  /**
   * Is this identity active, ie: not blocked by FC
   *
   * It coud be blocked through exploitation app, in case of suspected identoty thief
   */
  @Prop({ type: Boolean, default: true })
  active: boolean;

  /**
   * Expected format : { [identityProviderId]: identityProviderUserSub, ... },
   * Stores keys (subs OpenIdConnect) for Identity Provider
   */
  @Prop({ type: SchemaNative.Types.Mixed })
  idpFederation: IFederation;

  /**
   * Expected format : { [serviceProviderId]: serviceProviderUserSub, ... },
   * Stores keys (subs OpenIdConnect) for Service Provider
   */
  @Prop({ type: SchemaNative.Types.Mixed })
  spFederation: IFederation;
}

export const AccountSchema = SchemaFactory.createForClass(Account);

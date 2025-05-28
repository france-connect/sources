import { Document } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ strict: true, collection: 'client' })
export class ServiceProvider extends Document {
  @Prop({ type: String })
  name: string;

  @Prop({ type: Boolean })
  active: boolean;

  @Prop({ type: String, unique: true, index: true })
  key: string;

  @Prop({ type: String, index: true })
  entityId: string;

  @Prop({ type: Number })
  eidas: number;

  @Prop({ type: String })
  title: string;

  @Prop({ type: [String] })
  claims: string[];

  @Prop({ type: String })
  client_secret: string;

  @Prop({ type: [String] })
  scopes: string[];

  @Prop({ type: [String] })
  redirect_uris: string[];

  @Prop({ type: [String] })
  post_logout_redirect_uris: string[];

  @Prop({ type: String })
  sector_identifier_uri: string;

  @Prop({ type: String })
  id_token_signed_response_alg: string;

  @Prop({ type: String })
  id_token_encrypted_response_alg: string;

  @Prop({ type: String })
  id_token_encrypted_response_enc: string;

  @Prop({ type: String })
  userinfo_signed_response_alg: string;

  @Prop({ type: String })
  userinfo_encrypted_response_alg: string;

  @Prop({ type: String })
  userinfo_encrypted_response_enc: string;

  @Prop({ type: String })
  jwks_uri: string;

  @Prop({ type: Boolean })
  idpFilterExclude: boolean;

  @Prop({ type: [String] })
  idpFilterList: string[];

  @Prop({ type: [String] })
  IPServerAddressesAndRanges: string[];

  @Prop({ type: String })
  type: string;

  @Prop({ type: Boolean })
  identityConsent: boolean;

  @Prop({ type: String })
  platform: string;

  @Prop({ type: [String] })
  rep_scope: string[];

  @Prop({ type: [String] })
  site: string[];

  @Prop({ type: String })
  signup_id: string;

  @Prop({ type: String })
  email: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  @Prop({ type: Date, default: Date.now })
  secretCreatedAt: Date;

  @Prop({ type: Date, default: Date.now })
  secretUpdatedAt: Date;
}

export const ServiceProviderSchema =
  SchemaFactory.createForClass(ServiceProvider);

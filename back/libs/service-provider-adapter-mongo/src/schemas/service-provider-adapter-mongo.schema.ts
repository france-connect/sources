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

  @Prop({ type: String })
  // eslint-disable-next-line @typescript-eslint/naming-convention
  client_secret: string;

  @Prop({ type: [String] })
  scopes: string[];

  @Prop({ type: [String] })
  // eslint-disable-next-line @typescript-eslint/naming-convention
  redirect_uris: string[];
  // openid defined property names

  @Prop({ type: String })
  // eslint-disable-next-line @typescript-eslint/naming-convention
  id_token_signed_response_alg: string;

  @Prop({ type: String })
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  id_token_encrypted_response_alg: string;

  @Prop({ type: String })
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  id_token_encrypted_response_enc: string;

  @Prop({ type: String })
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  userinfo_signed_response_alg: string;

  @Prop({ type: String })
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  userinfo_encrypted_response_alg: string;

  @Prop({ type: String })
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  userinfo_encrypted_response_enc: string;

  @Prop({ type: String })
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  jwks_uri: string;

  @Prop({ type: Boolean })
  idpFilterExclude: boolean;

  @Prop({ type: [String] })
  idpFilterList: string[];

  @Prop({ type: String })
  type: string;

  @Prop({ type: Boolean })
  identityConsent: boolean;
}

export const ServiceProviderSchema =
  SchemaFactory.createForClass(ServiceProvider);

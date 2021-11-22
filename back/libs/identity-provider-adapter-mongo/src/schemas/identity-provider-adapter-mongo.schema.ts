import { Document, Schema as SchemaNative } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { IFeatureHandlerDatabase } from '@fc/feature-handler';

@Schema({ collection: 'provider', strict: true })
export class IdentityProvider extends Document {
  @Prop({ type: String })
  name: string;

  @Prop({ index: true, type: String })
  clientID: string;

  @Prop({ type: String })
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  client_secret: string;

  @Prop({ type: String })
  discoveryUrl: string;

  @Prop({ type: [String] })
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  redirect_uris: string[];

  @Prop({ type: [String] })
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  response_types: string[];

  @Prop({ type: String })
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  id_token_signed_response_alg: string;

  @Prop({ type: String })
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  token_endpoint_auth_method: string;

  @Prop({ type: String })
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  id_token_encrypted_response_alg: string;

  @Prop({ type: String })
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  id_token_encrypted_response_enc: string;

  @Prop({ type: String })
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  userinfo_signed_response_alg: string;

  @Prop({ type: String })
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  userinfo_encrypted_response_alg: string;

  @Prop({ type: String })
  // oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  userinfo_encrypted_response_enc: string;

  @Prop({ type: SchemaNative.Types.Mixed })
  featureHandlers: IFeatureHandlerDatabase;

  @Prop({ type: Number })
  eidas: number;
}

export const IdentityProviderSchema =
  SchemaFactory.createForClass(IdentityProvider);

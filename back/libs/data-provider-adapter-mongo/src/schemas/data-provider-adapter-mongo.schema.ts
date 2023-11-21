import { Document } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ strict: true, collection: 'dataProvider' })
export class DataProvider extends Document {
  @Prop({ type: String })
  uid: string;

  @Prop({ type: String })
  // :warning: Ceci est un champ métier (Ex: "Les services de la DGFIP")
  title: string;

  @Prop({ type: String })
  // :warning: Ceci est un champ métier (Ex: "Les services de la DGFIP")
  slug: string;

  @Prop({ type: Boolean })
  active: boolean;

  @Prop({ type: String, unique: true, index: true })
  // oidc like property
  // eslint-disable-next-line @typescript-eslint/naming-convention
  client_id: string;

  @Prop({ type: String, unique: true, index: true })
  // oidc like property
  // eslint-disable-next-line @typescript-eslint/naming-convention
  client_secret: string;

  @Prop({ type: String })
  // oidc like property
  // eslint-disable-next-line @typescript-eslint/naming-convention
  jwks_uri: string;
}

export const DataProviderSchema = SchemaFactory.createForClass(DataProvider);

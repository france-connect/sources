/* istanbul ignore file */

// Declarative code
import { Document } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collection: 'fqdnToProvider',
  strict: true,
})
export class FqdnToIdentityProvider extends Document {
  @Prop({ index: true, type: String })
  fqdn: string;

  @Prop({ type: String })
  identityProvider: string;
}

export const FqdnToIdentityProviderSchema = SchemaFactory.createForClass(
  FqdnToIdentityProvider,
);

/* istanbul ignore file */

// Declarative code
import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';

import { IdentityProviderAdapterEnvDTO } from './identity-provider-adapter-env.dto';

export class IdentityProviderAdapterEnvConfig {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IdentityProviderAdapter)
  readonly list: IdentityProviderAdapter[];
}

export class IdentityProviderAdapter extends IdentityProviderAdapterEnvDTO {
  @IsString()
  readonly clientSecretEncryptKey: string;
}

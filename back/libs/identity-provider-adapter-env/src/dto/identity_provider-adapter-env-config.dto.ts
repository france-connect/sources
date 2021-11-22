/* istanbul ignore file */

// Declarative code
import {
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  ValidateIf,
} from 'class-validator';
import { ClientMetadata } from 'openid-client';

export class IdentityProviderAdapterEnvConfig {
  // Mock Service Provider
  @IsObject()
  @IsOptional()
  readonly provider: ClientMetadata;

  @IsBoolean()
  readonly discovery: boolean;

  @IsUrl()
  @IsOptional()
  @ValidateIf((o) => o.discovery)
  readonly discoveryUrl: string;

  @IsString()
  readonly clientSecretEncryptKey: string;
}

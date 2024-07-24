import { IsBoolean, IsString } from 'class-validator';

export class IdentityProviderAdapterMongoConfig {
  @IsString()
  readonly clientSecretEncryptKey: string;

  @IsBoolean()
  readonly decryptClientSecretFeature: boolean;

  @IsBoolean()
  readonly disableIdpValidationOnLegacy: boolean;

  @IsString({ each: true })
  readonly allowedAcr: string[];
}

import { IsEnum, IsOptional, IsString } from 'class-validator';

import { platform } from '../enums';

export class ServiceProviderAdapterMongoConfig {
  @IsString()
  readonly clientSecretEncryptKey: string;

  @IsOptional()
  @IsEnum(platform)
  readonly platform?: platform;
}

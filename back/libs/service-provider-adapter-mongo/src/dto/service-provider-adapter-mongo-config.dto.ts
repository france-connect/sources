import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class ServiceProviderAdapterMongoConfig {
  @IsString()
  readonly clientSecretEncryptKey: string;

  @IsOptional()
  @IsString()
  readonly platform?: string;

  @IsBoolean()
  @IsOptional()
  readonly urlsRequireTld?: boolean;

  @IsBoolean()
  @IsOptional()
  readonly disableAutoLoading?: boolean;
}

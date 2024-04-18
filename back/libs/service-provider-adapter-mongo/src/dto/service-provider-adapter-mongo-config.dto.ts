import { IsOptional, IsString } from 'class-validator';

export class ServiceProviderAdapterMongoConfig {
  @IsString()
  readonly clientSecretEncryptKey: string;

  @IsOptional()
  @IsString()
  readonly platform?: string;
}

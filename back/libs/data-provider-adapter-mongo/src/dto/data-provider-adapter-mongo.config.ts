import { IsBoolean, IsString } from 'class-validator';

export class DataProviderAdapterMongoConfig {
  @IsString()
  readonly clientSecretEncryptKey: string;

  @IsBoolean()
  readonly decryptClientSecretFeature: boolean;
}

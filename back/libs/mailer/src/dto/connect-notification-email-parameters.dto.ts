import { IsOptional, IsString, IsUUID } from 'class-validator';

export class ConnectNotificationEmailParameters {
  @IsString()
  readonly person: string;

  @IsString()
  readonly idpTitle: string;

  @IsString()
  readonly spName: string;

  @IsString()
  readonly today: string;

  @IsString()
  readonly fqdn: string;

  @IsString()
  @IsOptional()
  readonly assetsUrlDomain?: string;

  @IsString()
  readonly assetsUrlPrefix: string;

  @IsString()
  readonly udFqdn: string;

  @IsUUID(4)
  readonly browsingSessionId: string;
}

import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { ConfigConfig } from '@fc/config';
import { ExceptionsConfig } from '@fc/exceptions/dto';
import { IdentityProviderAdapterEnvConfig } from '@fc/identity-provider-adapter-env';
import { LoggerConfig } from '@fc/logger';
import { OidcAcrConfig } from '@fc/oidc-acr';
import { RedisConfig } from '@fc/redis';
import { SessionConfig } from '@fc/session';

import { AppConfig } from './app-config.dto';
import { OidcClientConfig } from './oidc-client-config.dto';

export class MockServiceProviderConfig {
  @IsObject()
  @ValidateNested()
  @Type(() => AppConfig)
  readonly App: AppConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => ConfigConfig)
  readonly Config: ConfigConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => ExceptionsConfig)
  readonly Exceptions: ExceptionsConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => RedisConfig)
  readonly Redis: RedisConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => LoggerConfig)
  readonly Logger: LoggerConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => SessionConfig)
  readonly Session: SessionConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => OidcAcrConfig)
  readonly OidcAcr: OidcAcrConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => OidcClientConfig)
  readonly OidcClient: OidcClientConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => IdentityProviderAdapterEnvConfig)
  readonly IdentityProviderAdapterEnv: IdentityProviderAdapterEnvConfig;
}

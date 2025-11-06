import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { ExceptionsConfig } from '@fc/exceptions/dto';
import { I18nConfig } from '@fc/i18n';
import { IdentityProviderAdapterEnvConfig } from '@fc/identity-provider-adapter-env';
import { LoggerConfig } from '@fc/logger';
import { MicroservicesRmqConfig } from '@fc/microservices-rmq';
import { OidcAcrConfig } from '@fc/oidc-acr';
import { OidcClientConfig } from '@fc/oidc-client';
import { PostgresConfig } from '@fc/postgres';
import { RedisConfig } from '@fc/redis';
import { SessionConfig } from '@fc/session';
import { WebhooksConfig } from '@fc/webhooks';

import { AppConfig } from './app-config.dto';
import { DefaultServiceProviderLowValueConfig } from './default-service-provider-value.dto';

export class PartnersConfig {
  @IsObject()
  @ValidateNested()
  @Type(() => AppConfig)
  readonly App: AppConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => ExceptionsConfig)
  readonly Exceptions: ExceptionsConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => LoggerConfig)
  readonly Logger: LoggerConfig;

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
  @Type(() => PostgresConfig)
  readonly Postgres: PostgresConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => RedisConfig)
  readonly Redis: RedisConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => SessionConfig)
  readonly Session: SessionConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => I18nConfig)
  readonly I18n: I18nConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => IdentityProviderAdapterEnvConfig)
  readonly IdentityProviderAdapterEnv: IdentityProviderAdapterEnvConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => MicroservicesRmqConfig)
  readonly ConfigSandboxLowMicroService: MicroservicesRmqConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => DefaultServiceProviderLowValueConfig)
  readonly DefaultServiceProviderLowValue: DefaultServiceProviderLowValueConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => WebhooksConfig)
  readonly WebhooksDatapass: WebhooksConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => WebhooksConfig)
  readonly WebhooksInvitation: WebhooksConfig;
}

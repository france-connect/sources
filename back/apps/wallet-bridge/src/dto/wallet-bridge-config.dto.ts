import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { AppConfig } from '@fc/app';
import { ExceptionsConfig } from '@fc/exceptions';
import { I18nConfig } from '@fc/i18n';
import { LoggerConfig } from '@fc/logger';
import { LoggerConfig as LoggerLegacyConfig } from '@fc/logger-legacy';
import { OidcAcrConfig } from '@fc/oidc-acr';
import { OidcProviderConfig } from '@fc/oidc-provider';
import { Openid4vpConfig } from '@fc/openid4vp';
import { RedisConfig } from '@fc/redis';
import { ServiceProviderAdapterEnvConfig } from '@fc/service-provider-adapter-env';
import { SessionConfig } from '@fc/session';

export class WalletBridgeConfig {
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
  @Type(() => LoggerLegacyConfig)
  readonly LoggerLegacy: LoggerLegacyConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => OidcAcrConfig)
  readonly OidcAcr: OidcAcrConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => OidcProviderConfig)
  readonly OidcProvider: OidcProviderConfig;

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
  @Type(() => Openid4vpConfig)
  readonly Openid4vp: Openid4vpConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => ServiceProviderAdapterEnvConfig)
  readonly ServiceProviderAdapterEnv: ServiceProviderAdapterEnvConfig;
}

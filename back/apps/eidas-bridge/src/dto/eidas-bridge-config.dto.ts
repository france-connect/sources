import { Type } from 'class-transformer';
import { IsObject, IsUrl, ValidateNested } from 'class-validator';

import { ApacheIgniteConfig } from '@fc/apache-ignite';
import { CogConfig } from '@fc/cog';
import { CryptographyEidasConfig } from '@fc/cryptography-eidas';
import { EidasClientConfig } from '@fc/eidas-client';
import { EidasLightProtocolConfig } from '@fc/eidas-light-protocol';
import { EidasProviderConfig } from '@fc/eidas-provider';
import { ExceptionsConfig } from '@fc/exceptions';
import { I18nConfig } from '@fc/i18n';
import { IdentityProviderAdapterEnvConfig } from '@fc/identity-provider-adapter-env';
import { LoggerConfig } from '@fc/logger';
import { LoggerConfig as LoggerLegacyConfig } from '@fc/logger-legacy';
import { OidcAcrConfig } from '@fc/oidc-acr';
import { OidcClientConfig } from '@fc/oidc-client';
import { OidcProviderConfig } from '@fc/oidc-provider';
import { OverrideOidcProviderConfig } from '@fc/override-oidc-provider';
import { RedisConfig } from '@fc/redis';
import { ServiceProviderAdapterEnvConfig } from '@fc/service-provider-adapter-env';
import { SessionConfig } from '@fc/session';
import { TrackingConfig } from '@fc/tracking';

import { AppConfig } from './app-config.dto';

export class Core {
  @IsUrl()
  readonly defaultRedirectUri: string;
}
export class EidasBridgeConfig {
  @IsObject()
  @ValidateNested()
  @Type(() => Core)
  readonly Core: Core;

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
  @Type(() => CogConfig)
  readonly Cog: CogConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => CryptographyEidasConfig)
  readonly CryptographyEidas: CryptographyEidasConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => I18nConfig)
  readonly I18n: I18nConfig;

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
  @Type(() => RedisConfig)
  readonly Redis: RedisConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => SessionConfig)
  readonly Session: SessionConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => OidcClientConfig)
  readonly OidcClient: OidcClientConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => IdentityProviderAdapterEnvConfig)
  readonly IdentityProviderAdapterEnv: IdentityProviderAdapterEnvConfig;

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
  @Type(() => OverrideOidcProviderConfig)
  readonly OverrideOidcProvider: OverrideOidcProviderConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => ServiceProviderAdapterEnvConfig)
  readonly ServiceProviderAdapterEnv: ServiceProviderAdapterEnvConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => EidasClientConfig)
  readonly EidasClient: EidasClientConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => EidasProviderConfig)
  readonly EidasProvider: EidasProviderConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => ApacheIgniteConfig)
  readonly ApacheIgnite: ApacheIgniteConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => EidasLightProtocolConfig)
  readonly EidasLightProtocol: EidasLightProtocolConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => TrackingConfig)
  readonly Tracking: TrackingConfig;
}

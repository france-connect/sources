import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { CoreConfig } from '@fc/core';
import { DataProviderAdapterMongoConfig } from '@fc/data-provider-adapter-mongo';
import { ExceptionsConfig } from '@fc/exceptions/dto';
import { I18nConfig } from '@fc/i18n';
import { IdentityProviderAdapterMongoConfig } from '@fc/identity-provider-adapter-mongo';
import { LoggerConfig } from '@fc/logger';
import { LoggerConfig as LoggerLegacyConfig } from '@fc/logger-legacy';
import { MongooseConfig } from '@fc/mongoose';
import { OidcAcrConfig } from '@fc/oidc-acr';
import { OidcClientConfig } from '@fc/oidc-client';
import { OidcProviderConfig } from '@fc/oidc-provider';
import { OverrideOidcProviderConfig } from '@fc/override-oidc-provider';
import { RedisConfig } from '@fc/redis';
import { ScopesConfig } from '@fc/scopes';
import { ServiceProviderAdapterMongoConfig } from '@fc/service-provider-adapter-mongo';
import { SessionConfig } from '@fc/session';
import { TrackingConfig } from '@fc/tracking';

import { AppConfig } from './app-config.dto';

export class CoreFcaConfig {
  @IsObject()
  @ValidateNested()
  @Type(() => CoreConfig)
  readonly Core: CoreConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => AppConfig)
  readonly App: AppConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => I18nConfig)
  readonly I18n: I18nConfig;

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
  @Type(() => OidcClientConfig)
  readonly OidcClient: OidcClientConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => MongooseConfig)
  readonly Mongoose: MongooseConfig;

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
  @Type(() => OverrideOidcProviderConfig)
  readonly OverrideOidcProvider: OverrideOidcProviderConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => ServiceProviderAdapterMongoConfig)
  readonly ServiceProviderAdapterMongo: ServiceProviderAdapterMongoConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => IdentityProviderAdapterMongoConfig)
  readonly IdentityProviderAdapterMongo: IdentityProviderAdapterMongoConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => TrackingConfig)
  readonly Tracking: TrackingConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => DataProviderAdapterMongoConfig)
  readonly DataProviderAdapterMongo: DataProviderAdapterMongoConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => ScopesConfig)
  readonly Scopes: ScopesConfig;
}

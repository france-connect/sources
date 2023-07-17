/* istanbul ignore file */

// Declarative code
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsObject,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';

import { AppConfig } from '@fc/app';
import { ConfigConfig } from '@fc/config';
import { CoreConfig as CoreLibConfig } from '@fc/core';
import { CryptographyEidasConfig } from '@fc/cryptography-eidas';
import { CryptographyFcpConfig } from '@fc/cryptography-fcp';
import { DataProviderAdapterMongoConfig } from '@fc/data-provider-adapter-mongo';
import { IdentityProviderAdapterMongoConfig } from '@fc/identity-provider-adapter-mongo';
import { LoggerConfig } from '@fc/logger-legacy';
import { MailerConfig } from '@fc/mailer';
import { MongooseConfig } from '@fc/mongoose';
import { OidcAcrConfig } from '@fc/oidc-acr';
import { OidcClientConfig } from '@fc/oidc-client';
import { OidcProviderConfig } from '@fc/oidc-provider';
import { OverrideOidcProviderConfig } from '@fc/override-oidc-provider';
import { RedisConfig } from '@fc/redis';
import { RnippConfig } from '@fc/rnipp';
import { ScopesConfig } from '@fc/scopes';
import { ServiceProviderAdapterMongoConfig } from '@fc/service-provider-adapter-mongo';
import { SessionConfig } from '@fc/session';
import { TrackingConfig } from '@fc/tracking';

import { IdentitySource } from '../enums';

export class CoreConfig extends CoreLibConfig {
  @IsUrl()
  readonly supportFormUrl: string;

  @IsString({ each: true })
  readonly supportFormCodes: string[];

  @IsEnum(IdentitySource)
  readonly useIdentityFrom: IdentitySource;
}

export class CoreFcpConfig {
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
  @Type(() => ConfigConfig)
  readonly Config: ConfigConfig;

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
  @Type(() => RnippConfig)
  readonly Rnipp: RnippConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => SessionConfig)
  readonly Session: SessionConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => CryptographyFcpConfig)
  readonly CryptographyFcp: CryptographyFcpConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => CryptographyEidasConfig)
  readonly CryptographyEidas: CryptographyEidasConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => OverrideOidcProviderConfig)
  readonly OverrideOidcProvider: OverrideOidcProviderConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => MailerConfig)
  readonly Mailer: MailerConfig;

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
  @Type(() => DataProviderAdapterMongoConfig)
  readonly DataProviderAdapterMongo: DataProviderAdapterMongoConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => ScopesConfig)
  readonly Scopes: ScopesConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => TrackingConfig)
  readonly Tracking: TrackingConfig;
}

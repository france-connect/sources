/* istanbul ignore file */

// Declarative code
import { Type } from 'class-transformer';
import { IsObject, IsUrl, ValidateNested } from 'class-validator';

import { AppConfig } from '@fc/app';
import { CryptographyEidasConfig } from '@fc/cryptography-eidas';
import { CryptographyFcpConfig } from '@fc/cryptography-fcp';
import { IdentityProviderAdapterMongoConfig } from '@fc/identity-provider-adapter-mongo';
import { LoggerConfig } from '@fc/logger';
import { MailerConfig } from '@fc/mailer';
import { MongooseConfig } from '@fc/mongoose';
import { OidcClientConfig } from '@fc/oidc-client';
import { OidcProviderConfig } from '@fc/oidc-provider';
import { OverrideOidcProviderConfig } from '@fc/override-oidc-provider';
import { RedisConfig } from '@fc/redis';
import { RnippConfig } from '@fc/rnipp';
import { ServiceProviderAdapterMongoConfig } from '@fc/service-provider-adapter-mongo';
import { SessionConfig } from '@fc/session';

export class Core {
  @IsUrl()
  readonly defaultRedirectUri: string;
}

export class CoreFcpConfig {
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
  @Type(() => LoggerConfig)
  readonly Logger: LoggerConfig;

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
}

/* istanbul ignore file */

// Declarative code
import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { LoggerConfig } from '@fc/logger';
import { OidcProviderConfig } from '@fc/oidc-provider';
import { RedisConfig } from '@fc/redis';
/**
 * Rename this librairy into a more appropriate name `adapter`, `mongo`
 * @TODO #246 ETQ Dev, j'ai des application avec un nommage précis et explicite
 * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/246
 */
import { ServiceProviderAdapterEnvConfig } from '@fc/service-provider-adapter-env';
import { SessionConfig } from '@fc/session';

import { AppConfig } from './app-config.dto';

export class MockIdentityProviderConfig {
  @IsObject()
  @ValidateNested()
  @Type(() => OidcProviderConfig)
  readonly OidcProvider: OidcProviderConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => AppConfig)
  readonly App: AppConfig;

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
  @Type(() => ServiceProviderAdapterEnvConfig)
  readonly ServiceProviderAdapterEnv: ServiceProviderAdapterEnvConfig;
}

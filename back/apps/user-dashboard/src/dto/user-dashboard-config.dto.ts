/* istanbul ignore file */

// Declarative code
import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { AppConfig } from '@fc/app';
import { IdentityProviderAdapterEnvConfig } from '@fc/identity-provider-adapter-env';
import { LoggerConfig } from '@fc/logger';
import { OidcClientConfig } from '@fc/oidc-client';
import { RabbitmqConfig } from '@fc/rabbitmq';
import { RedisConfig } from '@fc/redis';
import { SessionConfig } from '@fc/session';

export class UserDashboardConfig {
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
  @Type(() => OidcClientConfig)
  readonly OidcClient: OidcClientConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => IdentityProviderAdapterEnvConfig)
  readonly IdentityProviderAdapterEnv: IdentityProviderAdapterEnvConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => RabbitmqConfig)
  readonly TracksBroker: RabbitmqConfig;
}

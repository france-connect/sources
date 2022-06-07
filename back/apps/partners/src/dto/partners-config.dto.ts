/* istanbul ignore file */

// Declarative code
import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { AppConfig } from '@fc/app';
import { LoggerConfig } from '@fc/logger-legacy';
import { PostgresConfig } from '@fc/postgres';
import { RedisConfig } from '@fc/redis';
import { SessionConfig } from '@fc/session';

export class PartnersConfig {
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
  @Type(() => PostgresConfig)
  readonly Postgres: PostgresConfig;
}

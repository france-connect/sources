/* istanbul ignore file */

import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class RedisConfig {
  @IsString()
  readonly host: string;

  @IsNumber()
  @Type(() => Number)
  readonly port: number;

  @IsNumber()
  @Type(() => Number)
  readonly db: number;

  /**
   * @TODO #148 Configure password on docker-compose and make this mandatory
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/148
   */
  @IsString()
  @IsOptional()
  readonly password: string;
}

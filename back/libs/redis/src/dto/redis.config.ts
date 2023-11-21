/* istanbul ignore file */

import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

class TlsConfig {
  @IsString()
  readonly ca: string;
}

export class RedisConfig {
  @IsString()
  @ValidateIf(({ sentinels }) => sentinels === undefined)
  readonly host: string;

  @Type(() => Number)
  @IsNumber()
  @ValidateIf(({ sentinels }) => sentinels === undefined)
  readonly port: number;

  @IsNumber()
  @Type(() => Number)
  readonly db: number;

  @IsString()
  @IsOptional()
  readonly password: string;

  @IsArray()
  @IsObject({ each: true })
  @ValidateNested()
  @Type(() => Sentinel)
  @ValidateIf(({ host }) => host === undefined)
  readonly sentinels: Sentinel[];

  @IsObject()
  @ValidateNested()
  @Type(() => TlsConfig)
  readonly tls: TlsConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => TlsConfig)
  readonly sentinelTLS: TlsConfig;

  @IsBoolean()
  readonly enableTLSForSentinelMode: boolean;

  @IsString()
  @IsOptional()
  @ValidateIf(({ sentinels }) => sentinels !== undefined)
  readonly sentinelPassword: string;

  @IsString()
  @ValidateIf(({ sentinels }) => sentinels !== undefined)
  readonly name: string;
}

class Sentinel {
  @IsString()
  readonly host: string;

  @IsNumber()
  @Type(() => Number)
  readonly port: number;
}

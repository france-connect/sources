import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class SslConfig {
  @IsBoolean()
  @IsOptional()
  readonly rejectUnauthorized?: boolean;

  @IsString()
  @IsOptional()
  readonly ca?: string;

  @IsString()
  @IsOptional()
  readonly key?: string;

  @IsString()
  @IsOptional()
  readonly cert?: string;
}

export class PostgresConfig {
  @IsString()
  @IsIn(['postgres'])
  // use of a reserved word exceptionally authorized based on postgres config
  readonly type: string;

  @IsString()
  readonly host: string;

  @IsNumber()
  readonly port: number;

  @IsString()
  readonly database: string;

  @IsString()
  readonly username: string;

  @IsString()
  @IsOptional()
  readonly password?: string;

  /**
   * We want instantiable only value (classes).
   * This protection is not enough to prevent errors but will help reduce the risk.
   */
  @IsArray()
  readonly entities: (new () => unknown)[];

  @IsBoolean()
  readonly synchronize: false;

  @IsObject()
  @ValidateNested()
  @IsOptional()
  @Type(() => SslConfig)
  readonly ssl?: SslConfig;
}

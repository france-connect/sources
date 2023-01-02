/* istanbul ignore file */

// Declarative code
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class SocketKeepAliveConfig {
  @IsBoolean()
  enable: boolean;

  @IsOptional()
  @IsPositive()
  initialDelay: number;
}

export class TlsConfig {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  cert: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  ca?: string;

  @IsBoolean()
  useTls: boolean;
}

export class AuthConfig {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class ApacheIgniteConfig {
  @IsString()
  @MinLength(1)
  endpoint: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => SocketKeepAliveConfig)
  socketKeepAlive?: SocketKeepAliveConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => TlsConfig)
  tls: TlsConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => AuthConfig)
  auth: AuthConfig;

  @IsNumber()
  @Min(1000) // 1 sec
  readonly maxRetryTimeout: number;
}

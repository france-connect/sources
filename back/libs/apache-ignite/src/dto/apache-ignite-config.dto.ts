/* istanbul ignore file */

// Declarative code
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
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

export class ApacheIgniteConfig {
  @IsString()
  @MinLength(1)
  endpoint: string;

  @IsObject()
  @ValidateNested()
  @Type(() => SocketKeepAliveConfig)
  socketKeepAlive?: SocketKeepAliveConfig;
}

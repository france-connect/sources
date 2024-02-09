/* istanbul ignore file */

// Declarative code
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';

import { LogLevels } from '../enums';

export class WsMultiplexerConfig {
  // class-validator options are snake_case
  // eslint-disable-next-line @typescript-eslint/naming-convention
  @IsUrl({ require_tld: false, require_valid_protocol: false })
  readonly address: string;

  @IsNumber()
  readonly port: number;

  @IsString()
  readonly path: string;
}

export class LoggerConfig {
  @IsEnum(LogLevels)
  readonly threshold: LogLevels;

  @IsEnum(LogLevels, { each: true })
  readonly stdoutLevels: LogLevels[];

  @IsEnum(LogLevels, { each: true })
  readonly stderrLevels: LogLevels[];

  @IsOptional()
  @ValidateNested()
  @Type(() => WsMultiplexerConfig)
  readonly wsMultiplexer?: object;
}

import { IsEnum, IsNumber, IsString, IsUrl } from 'class-validator';

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
}

import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { LoggerLevelNames } from '../enum';

export class LoggerConfig {
  @IsEnum(LoggerLevelNames)
  readonly level: LoggerLevelNames;

  @IsBoolean()
  readonly isDevelopment: boolean;

  @IsString()
  @IsNotEmpty()
  readonly path: string;
}

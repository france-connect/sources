import { IsEnum, IsOptional, IsString } from 'class-validator';

import { Environment } from '../enums';

export class AppCliConfig {
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsEnum(Environment)
  environment?: Environment;
}

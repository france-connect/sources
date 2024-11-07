/* istanbul ignore file */

// Declarative code
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { Environment } from '../enums';

export class AppRmqConfig {
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsEnum(Environment)
  environment?: Environment;
}

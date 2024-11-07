/* istanbul ignore file */

// Declarative code
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { AppMode } from '../enums';

export class AppSession {
  @IsOptional()
  @IsString()
  @IsEnum(AppMode)
  readonly mode?: string;
}

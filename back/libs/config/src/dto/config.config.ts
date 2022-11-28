/* istanbul ignore file */

// declarative code
import { IsObject, IsOptional } from 'class-validator';

import { TemplateExposedType } from '../types';

export class ConfigConfig {
  @IsObject()
  @IsOptional()
  readonly templateExposed?: TemplateExposedType;
}

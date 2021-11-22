/* istanbul ignore file */

// Declarative code
import { Type } from '@nestjs/common';

export interface IConfigOptions {
  config: Record<string, any>;
  schema: Type<any>;
}

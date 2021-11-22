/* istanbul ignore file */

// declarative code
import { Type } from '@nestjs/common';

export interface ISessionOptions {
  readonly schema: Type<unknown>;
}

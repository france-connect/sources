/* istanbul ignore file */

// Declarative file
import { Type } from '@nestjs/common';

export type TypeOrToken<T> = string | symbol | Function | Type<T>;

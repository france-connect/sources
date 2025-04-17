import { Type } from '@nestjs/common';

import { FunctionSafe } from './functions.type';

export type TypeOrToken<T> = string | symbol | FunctionSafe | Type<T>;

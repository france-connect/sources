import { TransformFnParams } from 'class-transformer';

import { parseBoolean } from '../helpers';

export function enforceBoolean({
  value,
}: TransformFnParams): boolean | undefined {
  return parseBoolean(value);
}

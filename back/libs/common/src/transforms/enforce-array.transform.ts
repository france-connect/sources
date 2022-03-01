import { TransformFnParams } from 'class-transformer';

type Value = Pick<TransformFnParams, 'value'>;

export function enforceArray({ value }: TransformFnParams): Value | Value[] {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

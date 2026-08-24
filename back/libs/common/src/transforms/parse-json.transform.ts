import {
  ClassConstructor,
  plainToInstance,
  TransformFnParams,
} from 'class-transformer';

/**
 * Parses a JSON string into an object.
 *
 * - If the value is not a string, it is returned as-is (e.g. already-parsed
 *   objects in tests or programmatic callers).
 * - On invalid JSON, the original string is returned unchanged so that a
 *   subsequent `@ValidateNested` decorator can reject it with a proper
 *   `ValidationPipe` 400 response instead of a raw `SyntaxError`.
 */
export function parseJson({ value }: TransformFnParams): unknown {
  if (typeof value !== 'string') {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

/**
 * Parses a JSON string and instantiates the result as an instance of `cls`.
 *
 * Use this instead of combining `@Transform(parseJson)` + `@Type(() => Cls)`
 * when the raw input is a JSON string (e.g. urlencoded body field).
 * `@Type()` only converts values that are already objects; it passes strings
 * through unchanged, so `@Transform(parseJson)` would produce a plain object
 * that `@ValidateNested` + `whitelist: true` would strip entirely.
 *
 * - If the value is already an object, it is converted to `cls` directly.
 * - On invalid JSON, the original string is returned unchanged so that
 *   `@ValidateNested` can emit a proper 400 instead of a raw `SyntaxError`.
 */
export function parseJsonAs<T>(
  cls: ClassConstructor<T>,
): (params: TransformFnParams) => T | string {
  return ({ value }: TransformFnParams): T | string => {
    const plain = parseJson({ value } as TransformFnParams);

    if (typeof plain === 'string') {
      return plain;
    }

    return plainToInstance(cls, plain);
  };
}

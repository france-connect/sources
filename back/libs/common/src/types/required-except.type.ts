/* istanbul ignore file */

// Declarative code
/**
 * This type can be used if you want only some properties of an object like to be optionals.
 */
export type RequiredExcept<T, TOptional extends keyof T = keyof T> = Required<
  Omit<T, TOptional>
> &
  Partial<Pick<T, TOptional>>;

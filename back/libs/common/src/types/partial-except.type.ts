/* istanbul ignore file */

// Declarative code
/**
 * This type can be used if you want only some properties of an object like to be required.
 */
export type PartialExcept<T, TRequired extends keyof T = keyof T> = Partial<
  Pick<T, Exclude<keyof T, TRequired>>
> &
  Required<Pick<T, TRequired>>;

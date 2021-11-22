/**
 * The OverrideCode class wraps given functions so that they can be later
 * overrided when used any where, including in external libraries.
 *
 * This is specially usefull when overrided library are imported by destructuring.
 * In this scenario, the code gets a direct reference to the library function,
 * so it can not be override later on.
 *
 * Exemple:
 *
 * ```typescript
 * import * as crypto from 'crypto';
 * OverrideCode.wrap(crypto, 'sign', 'crypto.sign');
 * OverrideCode.override('crypto.sign', (...args) => {
 *   // do anything...
 *
 *   // optionnally call original wrapped function
 *   const original = OverrideCode.getOriginal('crypto.sign');
 *   const result = original(...args);
 * });
 * ```
 */
export class OverrideCode {
  private static originalRefStore: { [key: string]: any } = {};
  private static overrideStore: { [key: string]: any } = {};

  /**
   * Wraps a method / function for latter override
   *
   * @param originalObject Object containing method to wrap
   * @param functionName name of the method to wrap
   * @param key Unique name of the wrap, used to store the original function and:
   *  - override (with `OverrideCode.override`) or
   *  - retrieve (with `OverrideCode.getoriginal`)the original function.
   *  Defaults to `functionName`
   *
   * @throws TypeError if `originalObject[functionName]` does not exists
   */
  static wrap(
    originalObject: any,
    functionName: string,
    key: string = functionName,
  ): void {
    // Check input
    if (!(functionName in originalObject)) {
      throw new TypeError(
        `Tried to wrap unexistant propery <${functionName}> of object`,
      );
    }
    // Store original function
    OverrideCode.originalRefStore[key] = originalObject[functionName];

    // Create a default proxy function and reference it for later override
    OverrideCode.overrideStore[key] = (...args) =>
      OverrideCode.originalRefStore[key](...args);

    // Override original function with ref to our proxy
    originalObject[functionName] = (...args) =>
      OverrideCode.overrideStore[key](...args);
  }

  /**
   * Get a reference to the original (wrapped) function
   *
   * Usefull to call the original function before or after a custom logic
   *
   * @param key name given at wrap time to get the original wrapped function
   * @returns the wrapped function/method
   * @throws TypeError if nothing is stored with the name `key`
   */
  static getOriginal(key: string) {
    // Check input
    if (!(key in OverrideCode.originalRefStore)) {
      throw new TypeError(`Tried to get unknown wrapped <${key}>`);
    }
    return OverrideCode.originalRefStore[key];
  }

  /**
   * Override wrapped function with cutom code.
   *
   * Original function can be called inside `overrideFunction`
   * with a call OverrideCode.getOriginal
   *
   * @param key Name given at wrap time to retrieve function to override
   * @param overrideFunction Function to execute instead of wrapped function
   */
  static override(key: string, overrideFunction: Function): void {
    OverrideCode.overrideStore[key] = overrideFunction;
  }
}

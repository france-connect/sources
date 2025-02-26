/**
 * The OverrideCode class wraps given functions so that they can be later
 * overridden when used any where, including in external libraries.
 *
 * This is specially useful when overridden library are imported by destructuring.
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
 *   // optionally call original wrapped function
 *   const original = OverrideCode.getOriginal('crypto.sign');
 *   const result = original(...args);
 * });
 * ```
 */
export class OverrideCode {
  private static originalRefStore: { [key: string]: Function } = {};
  private static overrideStore: { [key: string]: Function } = {};

  /**
   * Wraps a method / function for latter override
   *
   * @param originalObject Object containing method to wrap
   * @param functionName name of the method to wrap
   * @param key Unique name of the wrap, used to store the original function and:
   *  - override (with `OverrideCode.override`) or
   *  - retrieve (with `OverrideCode.getOriginal`)the original function.
   *  Defaults to `functionName`
   *
   * @throws TypeError if `originalObject[functionName]` does not exists
   */
  static wrap(
    originalObject: object,
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

  static restore(
    originalObject: object,
    functionName: string,
    key: string = functionName,
  ): void {
    if (!(functionName in originalObject)) {
      throw new TypeError(
        `Tried to restore unexistant propery <${functionName}> of object`,
      );
    }

    originalObject[functionName] = OverrideCode.originalRefStore[key];
  }

  /**
   * Get a reference to the original (wrapped) function
   *
   * Useful to call the original function before or after a custom logic
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
   * Override wrapped function with custom code.
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

  static execWithOriginal<T = unknown>(
    originalObject: object,
    functionName: string,
    key: string,
    func: Function,
  ): T {
    OverrideCode.restore(originalObject, functionName, key);

    const result = func();

    originalObject[functionName] = (...args) =>
      OverrideCode.overrideStore[key](...args);

    return result;
  }

  static async execWithOriginalAsync<T = unknown>(
    originalObject: object,
    functionName: string,
    key: string,
    func: Function,
  ): Promise<T> {
    OverrideCode.restore(originalObject, functionName, key);

    const result = await func();

    originalObject[functionName] = (...args) =>
      OverrideCode.overrideStore[key](...args);

    return result;
  }
}

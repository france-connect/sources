/* istanbul ignore file */

// declarative file
export interface ConfigStates<T> {
  blacklist?: boolean;
  whitelist?: boolean;
  defaultValue: T;
}

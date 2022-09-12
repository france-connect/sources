/* istanbul ignore file */

// declarative file
export interface ConfigStates<T> {
  blacklist?: boolean;
  whitelist?: boolean;
  // @TODO rename defaultValue to InitialState ???
  // to match RTK declaration
  defaultValue: T;
}

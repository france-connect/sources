/* istanbul ignore file */

// declarative file
import { ConfigStates } from './config-state.interface';

/**
 * Since we don't know what the state will be in this library but
 * we want to type its architecture, this is one of the few conditions
 * when we can use the "any" type. The state will be correctly typed by
 * the StoreProvider implementation on the application as :
 * `StoreProvider<typeof defaultState>` (to auto generate the state type)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface GlobalState<T = any> {
  [key: string]: ConfigStates<T>;
}

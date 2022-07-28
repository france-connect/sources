/* istanbul ignore file */

// declarative file

/**
 * @todo Either type the "flat" state (after the call to get initial state)
 * or find another solution with the team 🧽🧽🧽
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface InitialState<S = any> {
  [key: string]: S;
}

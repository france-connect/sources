/* istanbul ignore file */

// declarative file
import { FSA } from './fsa.interface';

/**
 * @todo next and dispatch probably have a react type.
 * We need to find it.
 */
export type SideEffectHandler = (
  action: FSA,
  dispatch: Function,
  state: unknown,
  next: Function,
) => {};

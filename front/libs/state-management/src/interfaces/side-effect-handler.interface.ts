/* istanbul ignore file */

// declarative file
import type { FSA } from '@fc/common';

import type { GlobalState } from './global-state.interface';

/**
 * @todo dispatch probably have a react type.
 * We need to find it.
 */
export type SideEffectHandler = (
  action: FSA,
  dispatch: Function,
  getState: () => GlobalState,
) => object | void;

import { FSA } from '@fc/common';

import { GlobalState, SideEffectMap } from '../interfaces';

export interface SideEffectsMiddlewareOptions {
  dispatch: Function;
  getState: () => GlobalState;
}

export function initSideEffectsMiddleware(sideEffects: SideEffectMap) {
  /**
   * @todo getState, dispatch and next probably have a react type.
   * We need to find it.
   */
  return ({ dispatch, getState }: SideEffectsMiddlewareOptions) =>
    (next: Function) =>
    async (action: FSA) => {
      const hasOwnProperty = Object.prototype.hasOwnProperty.call(sideEffects, action.type);

      if (hasOwnProperty) {
        sideEffects[action.type].call(null, action, dispatch, getState);
      }

      return next(action);
    };
}

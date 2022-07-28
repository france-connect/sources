import { FSA, SideEffectMap } from '../interfaces';

export function initSideEffectsMiddleware(sideEffects: SideEffectMap) {
  /**
   * @todo getState, dispatch and next probably have a react type.
   * We need to find it.
   */
  return ({ dispatch, getState }: { dispatch: Function; getState: Function }) =>
    (next: Function) =>
    async (action: FSA) => {
      const hasOwnProperty = Object.prototype.hasOwnProperty.call(sideEffects, action.type);

      if (hasOwnProperty) {
        return sideEffects[action.type].call(null, action, dispatch, getState(), next);
      }

      return next(action);
    };
}

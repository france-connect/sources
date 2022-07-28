import { ReducersMapObject } from 'redux';

import { FSA, InitialState } from './interfaces';

export function mapReducers<S extends InitialState>(reducers: ReducersMapObject) {
  return (state: S, action: FSA): S => {
    const hasOwnProperty = Object.prototype.hasOwnProperty.call(reducers, action.type);

    if (hasOwnProperty) {
      return reducers[action.type].call(null, state, action);
    }

    return state;
  };
}

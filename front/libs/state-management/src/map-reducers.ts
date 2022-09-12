import { ReducersMapObject } from 'redux';

import { FSA } from '@fc/common';

import { InitialState } from './interfaces';

export function mapReducers<S extends InitialState>(reducers: ReducersMapObject) {
  return (state: S, action: FSA): S => {
    const hasOwnProperty = Object.prototype.hasOwnProperty.call(reducers, action.type);
    // @TODO use immerjs to avoid mutating the state
    // https://github.com/immerjs/immer
    if (hasOwnProperty) {
      return reducers[action.type].call(null, state, action);
    }

    return state;
  };
}

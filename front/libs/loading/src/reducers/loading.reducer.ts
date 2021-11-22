import { Action } from '@fc/state-management';
import { Events } from '../events/events';
import * as states from '../states/loading.state';

const { defaultValue } = states.Loading;
export const Loading = (state = defaultValue, { type }: Action) => {
  switch (type) {
    case Events.LOADING_STARTED:
      return true;
    case Events.LOADING_COMPLETED:
      return false;
    default:
      return state;
  }
};

import { ACTION_TYPES } from '../../constants';

export const serviceProviderName = (state = '', action: any) => {
  switch (action.type) {
    case ACTION_TYPES.MINISTRY_LIST_LOAD_START:
      return '';
    case ACTION_TYPES.MINISTRY_LIST_LOAD_COMPLETED:
      return action?.payload?.serviceProviderName || state;
    default:
      return state;
  }
};

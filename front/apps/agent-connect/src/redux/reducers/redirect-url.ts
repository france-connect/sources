import { ACTION_TYPES } from '../../constants';

export const redirectURL = (state = '', action: any) => {
  switch (action.type) {
    case ACTION_TYPES.MINISTRY_LIST_LOAD_START:
      return '';
    case ACTION_TYPES.MINISTRY_LIST_LOAD_COMPLETED:
      return action?.payload?.redirectURL || state;
    default:
      return state;
  }
};

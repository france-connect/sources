import { ACTION_TYPES } from '../../constants';
import { Ministry } from '../../types';

const ministries = (state: Ministry[] | undefined = [], action: any) => {
  switch (action.type) {
    case ACTION_TYPES.MINISTRY_LIST_LOAD_START:
      return [];
    case ACTION_TYPES.MINISTRY_LIST_LOAD_COMPLETED:
      return [...action.payload.ministries];
    default:
      return state;
  }
};

export default ministries;

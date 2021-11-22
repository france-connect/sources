import { ACTION_TYPES } from '../../constants';

const redirectToIdentityProviderInputs = (state = {}, action: any) => {
  switch (action.type) {
    case ACTION_TYPES.MINISTRY_LIST_LOAD_START:
      return {};
    case ACTION_TYPES.MINISTRY_LIST_LOAD_COMPLETED:
      return action?.payload?.redirectToIdentityProviderInputs || state;
    default:
      return state;
  }
};

export default redirectToIdentityProviderInputs;

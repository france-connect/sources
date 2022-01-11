import { ACTION_TYPES } from '../../constants';
import { IdentityProvider } from '../../types';

export const identityProviders = (state: IdentityProvider[] | undefined = [], action: any) => {
  switch (action.type) {
    case ACTION_TYPES.MINISTRY_LIST_LOAD_START:
      return [];
    case ACTION_TYPES.MINISTRY_LIST_LOAD_COMPLETED:
      return [...action.payload.identityProviders];
    default:
      return state;
  }
};

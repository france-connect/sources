import { ACTION_TYPES } from '../../constants';
import { IdentityProvidersHistoryAction } from '../../types';

export const chosenIdentityProvider = (uid: string): IdentityProvidersHistoryAction => ({
  payload: uid,
  type: ACTION_TYPES.IDENTITY_PROVIDER_ADD,
});

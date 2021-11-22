import { ACTION_TYPES } from '../../constants';
import { IdentityProvidersHistoryAction } from '../../types';

export const removeIdentityProvider = (
  uid: string,
): IdentityProvidersHistoryAction => ({
  payload: uid,
  type: ACTION_TYPES.IDENTITY_PROVIDER_REMOVE,
});

export default removeIdentityProvider;

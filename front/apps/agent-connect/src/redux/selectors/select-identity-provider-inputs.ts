import { createCachedSelector } from 're-reselect';

import { IdentityProviderFormInputs, RootState } from '../../types';

const getRedirectToIdentityProviderInputs = (
  state: RootState,
): IdentityProviderFormInputs => state.redirectToIdentityProviderInputs;
const getUID = (_state: RootState, uid: string): string => uid;

export const selectIdentityProviderInputs = createCachedSelector(
  getRedirectToIdentityProviderInputs,
  getUID,
  (inputs, uid) =>
    Object.entries({
      ...inputs,
      providerUid: uid,
    }),
)((_state, uid) => `ministry::identityProviderInputs::${uid}`);

export default selectIdentityProviderInputs;

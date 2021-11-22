import { createCachedSelector } from 're-reselect';

import { IdentityProvider, RootState } from '../../types';

const getIdentityProviders = (state: RootState): IdentityProvider[] =>
  state.identityProviders;
const getUID = (_state: RootState, uid: string): string => uid;

export const selectIdentityProviderByUID = createCachedSelector(
  getIdentityProviders,
  getUID,
  (
    providers: IdentityProvider[],
    uid: string,
  ): IdentityProvider | undefined => {
    const found = providers.find(({ uid: id }) => id === uid);
    return found;
  },
)((_state, uid) => `ministry::identityProvider::${uid}`);

export default selectIdentityProviderByUID;

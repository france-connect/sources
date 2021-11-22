import { ACTION_TYPES } from '../../constants';
import { IdentityProvider } from '../../types';

export const removeIdentityProviderFromHistory = (
  previousState: string[],
  name: string,
) => {
  const nextState = previousState.filter((idp: string) => idp !== name);
  return nextState;
};

export const addIdentityProviderToHistory = (
  previousState: string[],
  name: string,
) => {
  const isAlreadyIncludedInPrevState = previousState.includes(name);
  if (isAlreadyIncludedInPrevState) {
    return previousState;
  }
  const nextState = [name, ...previousState].slice(0, 3);
  return nextState;
};

export const removeUnusedIdentityProviders = (
  previousState: string[],
  identityProviders: IdentityProvider[],
) => {
  const groupedIDs = identityProviders.map(({ uid }) => uid);
  const nextState = previousState.filter(id => groupedIDs.includes(id));
  return nextState;
};

const identityProvidersHistory = (
  state: string[] | undefined = [],
  action: any,
) => {
  switch (action.type) {
    case ACTION_TYPES.IDENTITY_PROVIDER_ADD:
      return addIdentityProviderToHistory(state, action.payload);
    case ACTION_TYPES.IDENTITY_PROVIDER_REMOVE:
      return removeIdentityProviderFromHistory(state, action.payload);
    case ACTION_TYPES.MINISTRY_LIST_LOAD_COMPLETED:
      return removeUnusedIdentityProviders(
        state,
        action.payload.identityProviders,
      );
    default:
      return state;
  }
};

export default identityProvidersHistory;

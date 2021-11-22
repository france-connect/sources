/* istanbul ignore file */

// declarative file
import { ActionCreator, AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { IdentityProvider } from './identity-provider.type';
import { Ministry } from './ministry.type';

// prettier-ignore
export type ThunkActionType = ActionCreator<ThunkAction<Promise<any>, RootState, null, AnyAction>>;

export type ThunkDispatchType = ThunkDispatch<RootState, null, AnyAction>;

export type IdentityProvidersHistoryAction = { payload: string; type: string };

export type IdentityProviderFormInputs = {
  acr_values: string;
  redirectUriServiceProvider: string;
  response_type: string;
  scope: string;
  csrfToken: string;
};

export type RootState = {
  ministries: Ministry[];
  identityProviders: IdentityProvider[];
  redirectURL: string;
  serviceProviderName: string;
  identityProvidersHistory: string[];
  redirectToIdentityProviderInputs: IdentityProviderFormInputs;
  csrfToken: string;
};

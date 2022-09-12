import { identityProviders } from './identity-providers';
import { ministries } from './ministries';

export const apiReturnValue = {
  identityProviders,
  ministries,
  redirectToIdentityProviderInputs: { csrfToken: 'csrf-token-mock' },
  serviceProviderName: 'service-provider-name-mock',
};

import { selectIdentityProviderByUID } from './select-identity-provider-by-uid';

const identityProviders = [
  { active: true, display: true, name: 'mock-name-1.1', uid: 'mock-1.1' },
  { active: true, display: true, name: 'mock-name-1.2', uid: 'mock-1.2' },
  { active: true, display: true, name: 'mock-name-2.1', uid: 'mock-2.1' },
  { active: true, display: true, name: 'mock-name-2.2', uid: 'mock-2.2' },
];

describe('selectIdentityProviderByUID', () => {
  it('should return a identity provider with an uid', () => {
    // setup
    const state = {
      identityProviders,
      identityProvidersHistory: [],
      ministries: [],
      redirectToIdentityProviderInputs: {
        acr_values: 'mock-acr',
        redirectUriServiceProvider: 'mock-uri',
        response_type: 'mock-type',
        scope: 'mock-scope',
      },
      redirectURL: 'mock-url',
      serviceProviderName: 'mock-sp-name',
    };
    // action
    const result = selectIdentityProviderByUID(state, 'mock-1.1');
    // expect
    expect(result).toStrictEqual({
      active: true,
      display: true,
      name: 'mock-name-1.1',
      uid: 'mock-1.1',
    });
  });
});

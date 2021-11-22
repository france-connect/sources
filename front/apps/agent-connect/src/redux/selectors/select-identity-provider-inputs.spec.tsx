import { RootState } from '../../types';
import { selectIdentityProviderInputs } from './select-identity-provider-inputs';

const rootState = {
  identityProvidersHistory: [],
  ministries: [],
  redirectToIdentityProviderInputs: {
    acr_values: 'eidas2',
    redirectUriServiceProvider:
      'https://fsa1-low.docker.dev-franceconnect.fr/login-callback',
    response_type: 'code',
    scope:
      'openid gender birthdate birthcountry birthplace given_name family_name email preferred_username address usual_name siret organizational_unit',
  },
  redirectURL: '',
  serviceProviderName: '',
} as unknown as RootState;

describe('selectIdentityProviderInputs', () => {
  it('should return an array of array from Object.entries [key, value]', () => {
    const uid = 'mock-uid';
    const result = selectIdentityProviderInputs(rootState, uid);
    // expected
    const expected = [
      ['acr_values', 'eidas2'],
      [
        'redirectUriServiceProvider',
        'https://fsa1-low.docker.dev-franceconnect.fr/login-callback',
      ],
      ['response_type', 'code'],
      [
        'scope',
        'openid gender birthdate birthcountry birthplace given_name family_name email preferred_username address usual_name siret organizational_unit',
      ],
      ['providerUid', uid],
    ];
    expect(result).toStrictEqual(expected);
  });
});

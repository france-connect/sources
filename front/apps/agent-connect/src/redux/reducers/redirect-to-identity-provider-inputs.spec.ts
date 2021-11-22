import { ACTION_TYPES } from '../../constants';
import redirectToIdentityProviderInputs from './redirect-to-identity-provider-inputs';

describe('redirectToIdentityProviderInputs', () => {
  describe('ACTION_TYPES.MINISTRY_LIST_LOAD_START', () => {
    it('should return an empty object', () => {
      const state = { mockKey: 'mock-value' };
      const action = { type: ACTION_TYPES.MINISTRY_LIST_LOAD_START };
      const result = redirectToIdentityProviderInputs(state, action);
      expect(result).toStrictEqual({});
    });
  });

  describe('ACTION_TYPES.MINISTRY_LIST_LOAD_COMPLETED', () => {
    it('should return previous object if there is no payload', () => {
      const state = { mockPreviousKey: 'mock-previous-value' };
      const action = {
        type: ACTION_TYPES.MINISTRY_LIST_LOAD_COMPLETED,
      };
      const result = redirectToIdentityProviderInputs(state, action);
      expect(result).toStrictEqual({ mockPreviousKey: 'mock-previous-value' });
    });

    it('should return previous object if there is no payload.redirectToIdentityProviderInputs', () => {
      const state = { mockPreviousKey: 'mock-previous-value' };
      const action = {
        payload: false,
        type: ACTION_TYPES.MINISTRY_LIST_LOAD_COMPLETED,
      };
      const result = redirectToIdentityProviderInputs(state, action);
      expect(result).toStrictEqual({ mockPreviousKey: 'mock-previous-value' });
    });

    it('should return the next state, the exact payload.redirectToIdentityProviderInputs value', () => {
      const state = 'mock-previous-value';
      const action = {
        payload: {
          redirectToIdentityProviderInputs: {
            acr_values: 'eidas2',
            redirectUriServiceProvider:
              'https://fsa1-low.docker.dev-franceconnect.fr/login-callback',
            response_type: 'code',
            scope:
              'openid gender birthdate birthcountry birthplace given_name family_name email preferred_username address usual_name siret organizational_unit',
          },
        },
        type: ACTION_TYPES.MINISTRY_LIST_LOAD_COMPLETED,
      };
      const result = redirectToIdentityProviderInputs(state, action);
      expect(result).toStrictEqual({
        acr_values: 'eidas2',
        redirectUriServiceProvider:
          'https://fsa1-low.docker.dev-franceconnect.fr/login-callback',
        response_type: 'code',
        scope:
          'openid gender birthdate birthcountry birthplace given_name family_name email preferred_username address usual_name siret organizational_unit',
      });
    });
  });
});

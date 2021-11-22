import { ACTION_TYPES } from '../../constants';
import { removeIdentityProvider } from './remove-identity-provider';

describe('removeIdentityProvider', () => {
  it('should return a redux action', () => {
    const uid = 'mock-uid';
    const result = removeIdentityProvider(uid);
    expect(result).toStrictEqual({
      payload: uid,
      type: ACTION_TYPES.IDENTITY_PROVIDER_REMOVE,
    });
  });
});

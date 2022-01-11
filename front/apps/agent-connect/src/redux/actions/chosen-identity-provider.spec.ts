import { ACTION_TYPES } from '../../constants';
import { chosenIdentityProvider } from './chosen-identity-provider';

describe('chosenIdentityProvider', () => {
  it('should return a redux action', () => {
    const uid = 'mock-uid';
    const result = chosenIdentityProvider(uid);
    expect(result).toStrictEqual({
      payload: uid,
      type: ACTION_TYPES.IDENTITY_PROVIDER_ADD,
    });
  });
});

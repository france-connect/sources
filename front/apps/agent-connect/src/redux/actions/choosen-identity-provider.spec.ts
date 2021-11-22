import { ACTION_TYPES } from '../../constants';
import { choosenIdentityProvider } from './choosen-identity-provider';

describe('choosenIdentityProvider', () => {
  it('should return a redux action', () => {
    const uid = 'mock-uid';
    const result = choosenIdentityProvider(uid);
    expect(result).toStrictEqual({
      payload: uid,
      type: ACTION_TYPES.IDENTITY_PROVIDER_ADD,
    });
  });
});

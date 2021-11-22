import { ACTION_TYPES } from '../../constants';
import identityProvidersHistory, {
  addIdentityProviderToHistory,
  removeIdentityProviderFromHistory,
  removeUnusedIdentityProviders,
} from './identity-providers-history';

const identityProviders = [
  {
    active: true,
    display: true,
    name: 'mock-fi-1.1',
    uid: 'mock-1.1',
  },
  {
    active: true,
    display: true,
    name: 'mock-fi-2.1',
    uid: 'mock-2.1',
  },
  {
    active: true,
    display: true,
    name: 'mock-fi-2.2',
    uid: 'mock-2.2',
  },
];

describe('identityProvidersHistory', () => {
  describe('ACTION_TYPES.IDENTITY_PROVIDER_ADD', () => {
    it('add uid at the start of reducer', () => {
      const state = ['mock-2', 'mock-3'];
      const action = {
        payload: 'mock-1',
        type: ACTION_TYPES.IDENTITY_PROVIDER_ADD,
      };
      const result = identityProvidersHistory(state, action);
      expect(result).toStrictEqual(['mock-1', 'mock-2', 'mock-3']);
    });

    it('add uid at the start of reducer, remove fourth value', () => {
      const state = ['mock-2', 'mock-3', 'mock-4'];
      const action = {
        payload: 'mock-1',
        type: ACTION_TYPES.IDENTITY_PROVIDER_ADD,
      };
      const result = identityProvidersHistory(state, action);
      expect(result).toStrictEqual(['mock-1', 'mock-2', 'mock-3']);
    });
  });

  describe('ACTION_TYPES.IDENTITY_PROVIDER_REMOVE', () => {
    it('remove an uid from the reducer', () => {
      const state = ['mock-1', 'mock-2', 'mock-3'];
      const action = {
        payload: 'mock-1',
        type: ACTION_TYPES.IDENTITY_PROVIDER_REMOVE,
      };
      const result = identityProvidersHistory(state, action);
      expect(result).toStrictEqual(['mock-2', 'mock-3']);
    });

    it('remove nothing from the reducer, if uid not exists', () => {
      const state = ['mock-1', 'mock-2', 'mock-3'];
      const action = {
        payload: 'mock-mock-mock',
        type: ACTION_TYPES.IDENTITY_PROVIDER_REMOVE,
      };
      const result = identityProvidersHistory(state, action);
      expect(result).toStrictEqual(['mock-1', 'mock-2', 'mock-3']);
    });
  });

  describe('ACTION_TYPES.MINISTRY_LIST_LOAD_COMPLETED', () => {
    it('remove unloaded uid/fi', () => {
      const state = ['mock-1', 'mock-2', 'mock-3'];
      const action = {
        payload: {
          identityProviders: [
            {
              active: true,
              name: 'mock-fi-1',
              uid: 'mock-1',
            },
          ],
        },
        type: ACTION_TYPES.MINISTRY_LIST_LOAD_COMPLETED,
      };
      const result = identityProvidersHistory(state, action);
      expect(result).toStrictEqual(['mock-1']);
    });
  });
});

describe('removeUnusedIdentityProviders', () => {
  it("should return an array of string, remove identity providers ids from user's history not loaded from backend", () => {
    const state = ['uid-not-loaded', 'mock-2.2'];
    const result = removeUnusedIdentityProviders(state, identityProviders);
    const expected = ['mock-2.2'];
    expect(result).toStrictEqual(expected);
  });
});

describe('addIdentityProviderToHistory', () => {
  it('should return an array, but will not add the name if already contained in the array', () => {
    const name = 'mock-name';
    const previousState = ['mock-1', 'mock-2', 'mock-name'];
    const result = addIdentityProviderToHistory(previousState, name);
    const expected = ['mock-name', 'mock-1', 'mock-2', 'mock-name'];
    expect(result).not.toStrictEqual(expected);
  });

  it('should return an array with a max length of 3', () => {
    const name = 'mock-name';
    const previousState = ['mock-1', 'mock-2', 'mock-3', 'mock-4'];
    const result = addIdentityProviderToHistory(previousState, name);
    const expected = ['mock-name', 'mock-1', 'mock-2'];
    expect(result).toStrictEqual(expected);
  });

  it('should return an array and add the name at the beginning of the array', () => {
    const name = 'mock-name';
    const previousState = ['mock-1', 'mock-2'];
    const result = addIdentityProviderToHistory(previousState, name);
    const expected = ['mock-name', 'mock-1', 'mock-2'];
    expect(result).toStrictEqual(expected);
  });
});

describe('removeIdentityProviderFromHistory', () => {
  it('should return an array and remove the name provided in parameters from previous array state, previous state is empty', () => {
    const name = 'mock-name';
    const previousState = [];
    const result = removeIdentityProviderFromHistory(previousState, name);
    const expected = [];
    expect(result).toStrictEqual(expected);
  });

  it('should return an array and remove the name provided in parameters from previous array state, previous state does not contains the name', () => {
    const name = 'mock-name';
    const previousState = ['mock-1', 'mock-2'];
    const result = removeIdentityProviderFromHistory(previousState, name);
    const expected = ['mock-1', 'mock-2'];
    expect(result).toStrictEqual(expected);
  });

  it('should return an array and remove the name provided in parameters from previous array state, previous state contains the name', () => {
    const name = 'mock-name';
    const previousState = ['mock-1', 'mock-2', 'mock-name'];
    const result = removeIdentityProviderFromHistory(previousState, name);
    const expected = ['mock-1', 'mock-2'];
    expect(result).toStrictEqual(expected);
  });
});

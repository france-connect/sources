import { ACTION_TYPES } from '../../constants';
import identityProviders from './identity-providers';

describe('identityProviders', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe('ACTION_TYPES.MINISTRY_LIST_LOAD_START', () => {
    it('remove fi from store on load start', () => {
      const state = [
        {
          active: true,
          display: true,
          name: 'mock-fi-1',
          uid: 'mock-1',
        },
      ];
      const action = {
        type: ACTION_TYPES.MINISTRY_LIST_LOAD_START,
      };
      const result = identityProviders(state, action);
      expect(result).toStrictEqual([]);
    });
  });

  describe('ACTION_TYPES.MINISTRY_LIST_LOAD_COMPLETED', () => {
    it('add fi from store on load completed', () => {
      const state = [
        {
          active: true,
          display: true,
          name: 'mock-fi-old',
          uid: 'mock-old',
        },
      ];
      const action = {
        payload: {
          identityProviders: [
            {
              active: true,
              display: true,
              name: 'mock-fi-1',
              uid: 'mock-1',
            },
          ],
        },
        type: ACTION_TYPES.MINISTRY_LIST_LOAD_COMPLETED,
      };
      const result = identityProviders(state, action);
      expect(result).toStrictEqual([
        {
          active: true,
          display: true,
          name: 'mock-fi-1',
          uid: 'mock-1',
        },
      ]);
    });
  });
});

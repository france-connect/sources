import { ACTION_TYPES } from '../../constants';
import redirectURL from './redirect-url';

describe('redirectURL', () => {
  describe('ACTION_TYPES.MINISTRY_LIST_LOAD_START', () => {
    it('should return an empty string', () => {
      const state = 'mock-previous-value';
      const action = { type: ACTION_TYPES.MINISTRY_LIST_LOAD_START };
      const result = redirectURL(state, action);
      expect(result).toStrictEqual('');
    });
  });

  describe('ACTION_TYPES.MINISTRY_LIST_LOAD_COMPLETED', () => {
    it('should return previous string if there is no payload', () => {
      const state = 'mock-previous-value';
      const action = {
        type: ACTION_TYPES.MINISTRY_LIST_LOAD_COMPLETED,
      };
      const result = redirectURL(state, action);
      expect(result).toStrictEqual('mock-previous-value');
    });

    it('should return previous string if there is no payload.redirectURL', () => {
      const state = 'mock-previous-value';
      const action = {
        payload: false,
        type: ACTION_TYPES.MINISTRY_LIST_LOAD_COMPLETED,
      };
      const result = redirectURL(state, action);
      expect(result).toStrictEqual('mock-previous-value');
    });

    it('should return the next state, the exact payload.redirectURL value', () => {
      const state = 'mock-previous-value';
      const action = {
        payload: { redirectURL: 'mock-next-value' },
        type: ACTION_TYPES.MINISTRY_LIST_LOAD_COMPLETED,
      };
      const result = redirectURL(state, action);
      expect(result).toStrictEqual('mock-next-value');
    });
  });
});

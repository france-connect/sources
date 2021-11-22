import { ACTION_TYPES } from '../../constants';
import serviceProviderName from './service-provider-name';

describe('serviceProviderName', () => {
  describe('ACTION_TYPES.MINISTRY_LIST_LOAD_START', () => {
    it('should return an empty string', () => {
      const state = 'mock-previous-value';
      const action = { type: ACTION_TYPES.MINISTRY_LIST_LOAD_START };
      const result = serviceProviderName(state, action);
      expect(result).toStrictEqual('');
    });
  });

  describe('ACTION_TYPES.MINISTRY_LIST_LOAD_COMPLETED', () => {
    it('should return the next state, the exact payload.serviceProviderName value', () => {
      const state = 'mock-previous-value';
      const action = {
        payload: { serviceProviderName: 'mock-next-value' },
        type: ACTION_TYPES.MINISTRY_LIST_LOAD_COMPLETED,
      };
      const result = serviceProviderName(state, action);
      expect(result).toStrictEqual('mock-next-value');
    });

    it('should return previous string if there is no payload', () => {
      const state = 'mock-previous-value';
      const action = {
        type: ACTION_TYPES.MINISTRY_LIST_LOAD_COMPLETED,
      };
      const result = serviceProviderName(state, action);
      expect(result).toStrictEqual('mock-previous-value');
    });

    it('should return previous string if there is no payload.serviceProviderName', () => {
      const state = 'mock-previous-value';
      const action = {
        payload: false,
        type: ACTION_TYPES.MINISTRY_LIST_LOAD_COMPLETED,
      };
      const result = serviceProviderName(state, action);
      expect(result).toStrictEqual('mock-previous-value');
    });
  });
});

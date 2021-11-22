import { ACTION_TYPES } from '../../constants';
import { Ministry } from '../../types';
import ministries from './ministries';

const mockMinistries = [
  {
    id: 'mock-ministry-id-1',
    identityProviders: [
      { active: true, name: 'mock-name-1.1', uid: 'mock-1.1' },
      { active: true, name: 'mock-name-1.2', uid: 'mock-1.2' },
    ],
    name: 'mock-ministry-name-1',
  },
  {
    id: 'mock-ministry-id-2',
    identityProviders: [
      { active: true, name: 'mock-name-2.1', uid: 'mock-2.1' },
      { active: true, name: 'mock-name-2.2', uid: 'mock-2.2' },
    ],
    name: 'mock-ministry-name-2',
  },
];

describe('ministries', () => {
  describe('ACTION_TYPES.MINISTRY_LIST_LOAD_START', () => {
    it('should return an empty array', () => {
      const state = [...mockMinistries];
      const action = { type: ACTION_TYPES.MINISTRY_LIST_LOAD_START };
      const result = ministries(state, action);
      expect(result).toStrictEqual([]);
    });
  });

  describe('ACTION_TYPES.MINISTRY_LIST_LOAD_COMPLETED', () => {
    it('should return the loaded ministries list', () => {
      const state: Ministry[] | undefined = [];
      const action = {
        payload: {
          ministries: mockMinistries,
        },
        type: ACTION_TYPES.MINISTRY_LIST_LOAD_COMPLETED,
      };
      const result = ministries(state, action);
      expect(result).toStrictEqual([...mockMinistries]);
    });
  });
});

import getPersistLists from './get-persist-lists';

jest.mock('redux-persist/lib/storage');

const mockStates = {
  mockState1: {
    blacklist: true,
    defaultValue: ['default', 'value', '1'],
  },
  mockState2: {
    blacklist: true,
    defaultValue: 'default value 2',
  },
  mockState3: {
    blacklist: false,
    defaultValue: 3,
  },
};

describe('getPersistLists', () => {
  beforeEach(() => {});

  it('should return a redux-persist configuration object, using default persist storage', () => {
    // when
    const result = getPersistLists(mockStates);
    // then
    expect(result).toStrictEqual({
      blacklist: ['mockState1', 'mockState2'],
      whitelist: ['mockState3'],
    });
  });

  it('should return a redux-persist configuration object, using custom persist storage', () => {
    // when
    const result = getPersistLists(mockStates);
    // then
    expect(result).toStrictEqual({
      blacklist: ['mockState1', 'mockState2'],
      whitelist: ['mockState3'],
    });
  });
});

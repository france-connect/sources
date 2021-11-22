import getInitialState from './get-initial-state';

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

describe('getInitialState', () => {
  beforeEach(() => {});

  it('should return an initial state object', () => {
    // when
    const result = getInitialState(mockStates);
    // then
    expect(result).toStrictEqual({
      mockState1: ['default', 'value', '1'],
      mockState2: 'default value 2',
      mockState3: 3,
    });
  });
});

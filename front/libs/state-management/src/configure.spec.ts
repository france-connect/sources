import * as redux from 'redux';
import * as reduxPersist from 'redux-persist';

import { bindMiddlewares } from './bind-middlewares';
import { configure } from './configure';
import { getInitialState } from './get-initial-state';
import { mapReducers } from './map-reducers';
import { getPersistLists } from './middlewares';

jest.mock('redux');
jest.mock('redux-persist');
jest.mock('redux-persist/lib/storage');
jest.mock('./bind-middlewares');
jest.mock('./map-reducers');
jest.mock('./middlewares/get-persist-lists.middleware');
jest.mock('./get-initial-state');

const mockPersistKey = expect.any(String);

const mockReducers = {
  mockReducer1: jest.fn(),
  mockReducer2: jest.fn(),
  mockReducer3: jest.fn(),
};

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

describe('configure', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should have called getInitialState method', () => {
    // when
    configure(mockPersistKey, mockStates, mockReducers);

    // then
    expect(getInitialState).toHaveBeenCalledTimes(1);
    expect(getInitialState).toHaveBeenCalledWith(mockStates);
  });

  it('should have called getPersistLists method', () => {
    // when
    configure(mockPersistKey, mockStates, mockReducers);

    // then
    expect(getPersistLists).toHaveBeenCalledTimes(1);
    expect(getPersistLists).toHaveBeenCalledWith(mockStates);
  });

  it('should have called mapReducers method', () => {
    // when
    configure(mockPersistKey, mockStates, mockReducers);

    // then
    expect(mapReducers).toHaveBeenCalledTimes(1);
    expect(mapReducers).toHaveBeenCalledWith(mockReducers);
  });

  it('should have called bindMiddlewares method', () => {
    // when
    configure(mockPersistKey, mockStates, mockReducers, [expect.any(Function)], true);

    // then
    expect(bindMiddlewares).toHaveBeenCalledTimes(1);
    expect(bindMiddlewares).toHaveBeenCalledWith([expect.any(Function)], true);
  });

  it('should have called redux.createStore method', () => {
    // when
    configure(mockPersistKey, mockStates, mockReducers, [expect.any(Function)], true);

    // then
    expect(redux.legacy_createStore).toHaveBeenCalledTimes(1);
  });

  it('should have called reduxPersist.persistStore method', () => {
    // when
    configure(mockPersistKey, mockStates, mockReducers);

    // then
    expect(reduxPersist.persistStore).toHaveBeenCalledTimes(1);
  });
});

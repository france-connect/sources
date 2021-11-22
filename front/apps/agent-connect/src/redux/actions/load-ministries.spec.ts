import axios from 'axios';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { loadMinistries } from './load-ministries';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('loadMinistries', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('should dispatch action', async () => {
    // setup
    const initialState = {};
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);
    const store = mockStore(initialState);
    mockedAxios.get.mockResolvedValue({ data: 'any-response-data-from-api' });

    // action
    const action = loadMinistries();
    await store.dispatch(action);

    // expect
    const actions = store.getActions();
    expect(actions).toStrictEqual([
      { type: 'MINISTRY_LIST_LOAD_START' },
      {
        payload: 'any-response-data-from-api',
        type: 'MINISTRY_LIST_LOAD_COMPLETED',
      },
    ]);
  });
});

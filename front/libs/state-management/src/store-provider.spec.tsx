/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react';
import { combineReducers, createStore } from 'redux';
import { persistStore } from 'redux-persist';
import { mocked } from 'ts-jest/utils';

import configure from './configure';
import { StoreProvider } from './store-provider';

jest.mock('./configure');
jest.mock('redux-persist/integration/react', () => ({
  // Fix PesistGate rehydrate event
  PersistGate: (props: any) => props.children,
}));

const mockReducer = (v = null) => v;
const mockStates = { mockReducer: { blacklist: true, defaultValue: null } };
const mockReducers = { mockReducer };
const mockStore = createStore(combineReducers(mockReducers));
const mockPersistor = persistStore(mockStore);
const MockChildren = () => <div>Hello World !</div>;

describe('StoreProvider', () => {
  it('should have called configure', () => {
    // given
    const persistKey = 'mock-key';
    const states = mockStates;
    const reducers = { mockReducer };
    const middlewares = [jest.fn()];
    const debugMode = false;

    const mockConfigure = mocked(configure, true);
    mockConfigure.mockReturnValue({
      persistor: mockPersistor,
      store: mockStore,
    });
    // when
    render(
      <StoreProvider
        debugMode={debugMode}
        middlewares={middlewares}
        persistKey={persistKey}
        reducers={mockReducers}
        states={mockStates}
      >
        <MockChildren />
      </StoreProvider>,
    );
    // then
    expect(mockConfigure).toHaveBeenCalled();
    expect(mockConfigure).toHaveBeenCalledTimes(1);
    expect(mockConfigure).toHaveBeenCalledWith(
      persistKey,
      states,
      reducers,
      middlewares,
      debugMode,
    );
  });

  it('should render the children', () => {
    // given
    const mockConfigure = mocked(configure, true);
    mockConfigure.mockReturnValue({
      persistor: mockPersistor,
      store: mockStore,
    });
    // when
    const { getByText } = render(
      <StoreProvider
        debugMode={false}
        middlewares={[jest.fn()]}
        persistKey="mock-key"
        reducers={mockReducers}
        states={mockStates}
      >
        <MockChildren />
      </StoreProvider>,
    );
    const textElement = getByText('Hello World !');
    // then
    expect(textElement).toBeInTheDocument();
  });
});

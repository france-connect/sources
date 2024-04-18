import { render } from '@testing-library/react';

import { AppContextProvider, mergeState } from './app-context';

const stateMock = {};
const setStateMock = jest.fn(() => ({}));

const ChildrenComponentMock = () => <div>mock children</div>;

// @TOOD creat a React mock into __mocks__ folder
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
jest.mock<typeof import('react')>('react', () => ({
  ...jest.requireActual('react'),
  useState: () => [stateMock, setStateMock],
}));

describe('mergeState', () => {
  it('should return an overrided object', () => {
    // given
    const base = {
      config: {
        prop1: 'it will be overriden',
        prop2: 'it will not be merged',
      },
      extraPropertyFromBase: 'it will be merged',
      user: { connected: false },
    };
    const extend = {
      config: {
        prop1: 'it has been overriden',
      },
      extraPropertyFromExtend: 'it will be merged',
      user: { connected: true },
    };
    const result = mergeState(base, extend);
    // then
    expect(result).toStrictEqual({
      config: {
        prop1: 'it has been overriden',
      },
      extraPropertyFromBase: 'it will be merged',
      extraPropertyFromExtend: 'it will be merged',
      user: { connected: true },
    });
  });
});

describe('AppContextProvider', () => {
  it('should have render the children', () => {
    // given
    const { getByText } = render(
      <AppContextProvider value={{}}>
        <ChildrenComponentMock />
      </AppContextProvider>,
    );
    // then
    expect(getByText('mock children')).toBeInTheDocument();
  });
});

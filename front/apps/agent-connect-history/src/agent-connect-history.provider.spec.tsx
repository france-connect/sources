import { render } from '@testing-library/react';
import { mocked } from 'jest-mock';

import { useLocalStorage } from '@fc/common';

import { AgentConnectHistoryContext } from './agent-connect-history.context';
import { AgentConnectHistoryProvider } from './agent-connect-history.provider';

// given
const contextCallback = jest.fn();

const Wrapper = () => (
  <AgentConnectHistoryProvider localStorageKey="any-local-storage-uniq-key">
    <div />
    <AgentConnectHistoryContext.Consumer>{contextCallback}</AgentConnectHistoryContext.Consumer>
  </AgentConnectHistoryProvider>
);

describe('AgentConnectHistoryProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have called useLocalStorage twice at first render', () => {
    // when
    render(<Wrapper />);

    // then
    expect(useLocalStorage).toHaveBeenCalledTimes(1);
    expect(useLocalStorage).toHaveBeenCalledWith('any-local-storage-uniq-key');
  });

  it('should have called contextCallback with default values', () => {
    // when
    render(<Wrapper />);

    // then
    expect(contextCallback).toHaveBeenCalledTimes(1);
    expect(contextCallback).toHaveBeenNthCalledWith(1, {
      localStorageKey: 'any-local-storage-uniq-key',
      setUserHistory: expect.any(Function),
      userHistory: [],
    });
  });

  it('should have called contextCallback with defined values from localstorage', () => {
    // given
    mocked(useLocalStorage).mockReturnValue({
      flush: jest.fn(),
      get: jest.fn(() => ['idp-1', 'idp-2']),
      set: jest.fn(),
    });

    // when
    render(<Wrapper />);

    // then
    expect(contextCallback).toHaveBeenCalledTimes(1);
    expect(contextCallback).toHaveBeenNthCalledWith(1, {
      localStorageKey: 'any-local-storage-uniq-key',
      setUserHistory: expect.any(Function),
      userHistory: ['idp-1', 'idp-2'],
    });
  });
});

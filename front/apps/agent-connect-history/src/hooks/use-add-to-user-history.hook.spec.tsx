import { useLocalStorage } from '@fc/common';
import { renderWithContext } from '@fc/tests-utils';

import { AgentConnectHistoryContext } from '../agent-connect-history.context';
import { useAddToUserHistory } from './use-add-to-user-history.hook';

// given
const currentMock = ['idp-3', 'idp-2', 'idp-1'];
const getMock = jest.fn(() => currentMock);
const setMock = jest.fn();

const contextValuesMock = {
  localStorageKey: 'any-string',
  setUserHistory: jest.fn(),
  userHistory: jest.fn(),
};

describe('addToUserHistory', () => {
  jest.mocked(useLocalStorage).mockReturnValue({
    flush: jest.fn(),
    get: getMock,
    set: setMock,
  });

  it('should have returned a function', () => {
    // given
    const idpIdMock = 'idp-4';

    // when
    const { result } = renderWithContext(
      () => useAddToUserHistory(idpIdMock),
      AgentConnectHistoryContext,
      contextValuesMock,
    );

    // then
    expect(result.current).toBeInstanceOf(Function);
  });

  it('should have called context useLocalStorage.get', () => {
    // given
    const idpIdMock = 'idp-4';

    // when
    const { result } = renderWithContext(
      () => useAddToUserHistory(idpIdMock),
      AgentConnectHistoryContext,
      contextValuesMock,
    );
    result.current();

    // then
    expect(getMock).toHaveBeenCalledTimes(1);
    expect(getMock).toHaveBeenNthCalledWith(1, 'identityProviders');
  });

  it('should have called context useLocalStorage.set', () => {
    // given
    const idpIdMock = 'idp-4';

    // when
    const { result } = renderWithContext(
      () => useAddToUserHistory(idpIdMock),
      AgentConnectHistoryContext,
      contextValuesMock,
    );
    result.current();

    // then
    expect(setMock).toHaveBeenCalledTimes(1);
    expect(setMock).toHaveBeenNthCalledWith(1, { identityProviders: ['idp-4', 'idp-3', 'idp-2'] });
  });

  it('should have called context useLocalStorage.set 4 times with the same value', () => {
    // given
    const idpIdMock = 'idp-4';

    // when
    const { result } = renderWithContext(
      () => useAddToUserHistory(idpIdMock),
      AgentConnectHistoryContext,
      contextValuesMock,
    );
    result.current();
    result.current();
    result.current();
    result.current();

    // then
    expect(setMock).toHaveBeenCalledTimes(4);
    expect(setMock).toHaveBeenNthCalledWith(1, { identityProviders: ['idp-4', 'idp-3', 'idp-2'] });
    expect(setMock).toHaveBeenNthCalledWith(2, { identityProviders: ['idp-4', 'idp-3', 'idp-2'] });
    expect(setMock).toHaveBeenNthCalledWith(3, { identityProviders: ['idp-4', 'idp-3', 'idp-2'] });
    expect(setMock).toHaveBeenNthCalledWith(4, { identityProviders: ['idp-4', 'idp-3', 'idp-2'] });
  });

  it('should have not called context useLocalStorage.set if value already exists', () => {
    // given
    const idpIdMock = 'idp-4';
    jest.mocked(useLocalStorage).mockReturnValueOnce({
      flush: jest.fn(),
      get: jest.fn(() => [idpIdMock, 'idp-3', 'idp-2']),
      set: setMock,
    });

    // when
    const { result } = renderWithContext(
      () => useAddToUserHistory(idpIdMock),
      AgentConnectHistoryContext,
      contextValuesMock,
    );
    result.current();
    result.current();
    result.current();
    result.current();

    // then
    expect(setMock).toHaveBeenCalledTimes(0);
  });

  it('should have called context useLocalStorage.set 4 times with the uid', () => {
    // given
    const idpIdMock = 'idp-4';
    jest.mocked(useLocalStorage).mockReturnValueOnce({
      flush: jest.fn(),
      get: jest.fn(() => undefined),
      set: setMock,
    });

    // when
    const { result } = renderWithContext(
      () => useAddToUserHistory(idpIdMock),
      AgentConnectHistoryContext,
      contextValuesMock,
    );
    result.current();
    result.current();
    result.current();
    result.current();

    // then
    expect(setMock).toHaveBeenCalledTimes(4);
    expect(setMock).toHaveBeenNthCalledWith(1, { identityProviders: ['idp-4'] });
    expect(setMock).toHaveBeenNthCalledWith(2, { identityProviders: ['idp-4'] });
    expect(setMock).toHaveBeenNthCalledWith(3, { identityProviders: ['idp-4'] });
    expect(setMock).toHaveBeenNthCalledWith(4, { identityProviders: ['idp-4'] });
  });
});

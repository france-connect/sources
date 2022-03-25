import { renderWithContext } from '@fc/tests-utils';

import { AgentConnectHistoryContext } from '../agent-connect-history.context';
import { useRemoveFromUserHistory } from './use-remove-from-user-history.hook';

// given
const setUserHistoryMock = jest.fn();
const userHistoryMock = ['idp-1', 'idp-2', 'idp-3'];
const contextValuesMock = { setUserHistory: setUserHistoryMock, userHistory: userHistoryMock };

describe('useRemoveFromUserHistory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have returned a function', () => {
    // given
    const idpIdMock = 'idp-2';
    // when
    const { result } = renderWithContext(
      () => useRemoveFromUserHistory(idpIdMock),
      AgentConnectHistoryContext,
      contextValuesMock,
    );
    // then
    expect(result.current).toBeInstanceOf(Function);
  });

  it('should have called context setUserHistory', () => {
    // given
    const idpIdMock = 'idp-2';
    // when
    const { result } = renderWithContext(
      () => useRemoveFromUserHistory(idpIdMock),
      AgentConnectHistoryContext,
      contextValuesMock,
    );
    result.current();
    // then
    expect(setUserHistoryMock).toHaveBeenCalledTimes(1);
    expect(setUserHistoryMock).toHaveBeenNthCalledWith(1, ['idp-1', 'idp-3']);
  });

  it('should have called context setUserHistory 4 times but return the same value', () => {
    // given
    const idpIdMock = 'idp-2';
    // when
    const { result } = renderWithContext(
      () => useRemoveFromUserHistory(idpIdMock),
      AgentConnectHistoryContext,
      contextValuesMock,
    );
    result.current();
    result.current();
    result.current();
    result.current();
    // then
    expect(setUserHistoryMock).toHaveBeenCalledTimes(4);
    expect(setUserHistoryMock).toHaveBeenNthCalledWith(1, ['idp-1', 'idp-3']);
    expect(setUserHistoryMock).toHaveBeenNthCalledWith(2, ['idp-1', 'idp-3']);
    expect(setUserHistoryMock).toHaveBeenNthCalledWith(3, ['idp-1', 'idp-3']);
    expect(setUserHistoryMock).toHaveBeenNthCalledWith(4, ['idp-1', 'idp-3']);
  });
});

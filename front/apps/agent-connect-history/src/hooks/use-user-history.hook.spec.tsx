import { IdentityProvider } from '@fc/agent-connect-search';
import { renderWithContext } from '@fc/tests-utils';

import { AgentConnectHistoryContext } from '../agent-connect-history.context';
import { useUserHistory } from './use-user-history.hook';

// given
const setUserHistoryMock = jest.fn();
const userHistoryMock = ['idp-uid-mock-1', 'idp-uid-mock-3'];
const contextValuesMock = { setUserHistory: setUserHistoryMock, userHistory: userHistoryMock };

describe('useUserHistory', () => {
  it('should have return default values', () => {
    // given
    const identityProviders: IdentityProvider[] = [];

    // when
    const { result } = renderWithContext(
      () => useUserHistory(identityProviders),
      AgentConnectHistoryContext,
      contextValuesMock,
    );

    // then
    expect(result.current).toHaveLength(0);
  });

  it('should have return only once with default values', () => {
    // given
    const identityProviders: IdentityProvider[] = [];

    // when
    const { rerender, result } = renderWithContext(
      () => useUserHistory(identityProviders),
      AgentConnectHistoryContext,
      contextValuesMock,
    );
    rerender();
    rerender();
    rerender();
    rerender();

    // then
    expect(result.current).toHaveLength(0);
  });

  it('should have return included identity providers', () => {
    // given
    const identityProviders: IdentityProvider[] = [
      {
        active: false,
        display: false,
        name: 'idp-name-mock-1',
        uid: 'idp-uid-mock-1',
      },
      {
        active: false,
        display: false,
        name: 'idp-name-mock-2',
        uid: 'idp-uid-mock-2',
      },
      {
        active: false,
        display: false,
        name: 'idp-name-mock-3',
        uid: 'idp-uid-mock-3',
      },
    ];

    // when
    const { result } = renderWithContext(
      () => useUserHistory(identityProviders),
      AgentConnectHistoryContext,
      contextValuesMock,
    );

    // then
    expect(result.current).toHaveLength(2);
    expect(result.current).toStrictEqual([
      {
        active: false,
        display: false,
        name: 'idp-name-mock-1',
        uid: 'idp-uid-mock-1',
      },
      {
        active: false,
        display: false,
        name: 'idp-name-mock-3',
        uid: 'idp-uid-mock-3',
      },
    ]);
  });
});

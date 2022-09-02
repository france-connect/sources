import { render } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { useMediaQuery } from 'react-responsive';

import { AgentConnectSearchContext } from '@fc/agent-connect-search';
import { RedirectToIdpFormComponent } from '@fc/oidc-client';

import { UserHistoryCardContentComponent } from './user-history-card-content.component';

describe('UserHistoryCardContentComponent', () => {
  const agentConnectSearchContextMock = {
    hasSearched: false,
    payload: {
      csrfToken: 'any-csrf-token-mock',
      identityProviders: [],
      isLoaded: false,
      ministries: [],
      serviceProviderName: 'Service provider name mock',
    },
    searchResults: [],
    setSearchTerm: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have called useMediaQuery with tablet responsive query', () => {
    // then
    render(<UserHistoryCardContentComponent identityProvider={expect.any(Object)} />);
    // when
    expect(useMediaQuery).toHaveBeenNthCalledWith(1, { query: '(min-width: 768px)' });
  });

  it('should match the snapshot for a tablet viewport', () => {
    // given
    mocked(useMediaQuery).mockReturnValueOnce(false);
    // when
    const { container } = render(
      <UserHistoryCardContentComponent identityProvider={expect.any(Object)} />,
    );
    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot for a desktop viewport', () => {
    // when
    const { container } = render(
      <UserHistoryCardContentComponent identityProvider={expect.any(Object)} />,
    );
    // then
    expect(container).toMatchSnapshot();
  });

  it('should have the title', () => {
    // when
    const { getByText } = render(
      <UserHistoryCardContentComponent identityProvider={expect.any(Object)} />,
    );
    const element = getByText('Mon compte');
    // then
    expect(element).toBeInTheDocument();
  });

  it('should have render the IdentityProvider name', () => {
    // given
    const identityProvider = {
      active: false,
      display: false,
      name: 'idp-mock-name',
      uid: 'idp-mock-uid',
    };
    // when
    const { getByText } = render(
      <UserHistoryCardContentComponent identityProvider={identityProvider} />,
    );
    const element = getByText('idp-mock-name');
    // then
    expect(element).toBeInTheDocument();
  });

  it('should use RedirectToIdpFormComponent', () => {
    // given
    const identityProvider = {
      active: false,
      display: false,
      name: 'idp-mock-name',
      uid: 'idp-mock-uid',
    };
    // when
    render(
      <AgentConnectSearchContext.Provider value={agentConnectSearchContextMock}>
        <UserHistoryCardContentComponent identityProvider={identityProvider} />
      </AgentConnectSearchContext.Provider>,
    );
    // then
    expect(RedirectToIdpFormComponent).toHaveBeenCalledTimes(1);
    expect(RedirectToIdpFormComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        csrf: 'any-csrf-token-mock',
        id: `fca-history-idp-idp-mock-uid`,
        uid: 'idp-mock-uid',
      }),
      {},
    );
  });
});

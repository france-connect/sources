import { render } from '@testing-library/react';
import { useMediaQuery } from 'react-responsive';
import { mocked } from 'ts-jest/utils';

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

  it('should render the component for a tablet viewport', () => {
    // given
    mocked(useMediaQuery).mockReturnValueOnce(false);
    // when
    const { getByTestId } = render(
      <UserHistoryCardContentComponent identityProvider={expect.any(Object)} />,
    );
    const element = getByTestId('container');
    // then
    expect(element).toHaveClass('p24');
    expect(element).not.toHaveClass('px24 pt24');
  });

  it('should render the component for a desktop viewport', () => {
    // when
    const { getByTestId } = render(
      <UserHistoryCardContentComponent identityProvider={expect.any(Object)} />,
    );
    const element = getByTestId('container');
    // then
    expect(element).not.toHaveClass('p24');
    expect(element).toHaveClass('px24 pt24');
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

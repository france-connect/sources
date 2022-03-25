import { render } from '@testing-library/react';
import { useMediaQuery } from 'react-responsive';
import { mocked } from 'ts-jest/utils';

import { AgentConnectSearchContext } from '@fc/agent-connect-search';

import { ServiceProviderNameComponent } from './service-provider-name.component';

describe('ServiceProviderNameComponent', () => {
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

  it('should have call useMediaQuery with tablet responsive query', () => {
    // when
    render(<ServiceProviderNameComponent />);
    // then
    expect(useMediaQuery).toHaveBeenNthCalledWith(1, { query: '(min-width: 768px)' });
  });

  it('should have a section title', () => {
    // then
    const { getByText } = render(<ServiceProviderNameComponent />);
    const element = getByText('Je choisis un compte pour me connecter sur');
    // when
    expect(element).toBeInTheDocument();
  });

  it('should have a serviceProviderName label', () => {
    // then
    const { getByText } = render(
      <AgentConnectSearchContext.Provider value={agentConnectSearchContextMock}>
        <ServiceProviderNameComponent />
      </AgentConnectSearchContext.Provider>,
    );
    const element = getByText('Service provider name mock');
    // when
    expect(element).toBeInTheDocument();
  });

  it('should render the component for a desktop viewport', () => {
    // when
    const { getByTestId } = render(<ServiceProviderNameComponent />);
    const elementWrapper = getByTestId('wrapper');
    const elementTitle = getByTestId('title');
    const elementSubtitle = getByTestId('subtitle');
    // then
    expect(elementWrapper).toHaveClass('text-center');
    expect(elementTitle).not.toHaveClass('fr-text-lg');
    expect(elementTitle).toHaveClass('fs28');
    expect(elementSubtitle).not.toHaveClass('fs32 mb40');
    expect(elementSubtitle).toHaveClass('fs40 mb64');
  });

  it('should render the component for a tablet viewport', () => {
    // given
    mocked(useMediaQuery).mockReturnValueOnce(false);
    // when
    const { getByTestId } = render(<ServiceProviderNameComponent />);
    const elementWrapper = getByTestId('wrapper');
    const elementTitle = getByTestId('title');
    const elementSubtitle = getByTestId('subtitle');
    // then
    expect(elementWrapper).not.toHaveClass('text-center');
    expect(elementTitle).toHaveClass('fr-text-lg');
    expect(elementTitle).not.toHaveClass('fs28');
    expect(elementSubtitle).toHaveClass('fs32 mb40');
    expect(elementSubtitle).not.toHaveClass('fs40 mb64');
  });

  it('should have called useMediaQuery with tablet responsive query', () => {
    // then
    render(<ServiceProviderNameComponent />);
    // when
    expect(useMediaQuery).toHaveBeenNthCalledWith(1, { query: '(min-width: 768px)' });
  });
});

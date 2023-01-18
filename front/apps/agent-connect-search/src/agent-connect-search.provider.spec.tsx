import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import { useApiGet } from '@fc/common';

import {
  apiReturnValue,
  defaultContextValues,
  identityProviders,
  ministries,
  searchResults,
} from './__fixtures__';
import { AgentConnectSearchContext } from './agent-connect-search.context';
import { AgentConnectSearchProvider } from './agent-connect-search.provider';
import { AgentConnectSearchService } from './services';

jest.mock('@fc/common');
jest.mock('./services/agent-connect-search.service');

// given
const contextCallback = jest.fn(({ setSearchTerm }) => (
  <React.Fragment>
    <button
      data-testid="valid-button"
      type="button"
      onClick={() => setSearchTerm('this is the search term')}>
      search button
    </button>
    <button data-testid="invalid-button" type="button" onClick={() => setSearchTerm(false)}>
      search button
    </button>
  </React.Fragment>
));

const Wrapper = () => (
  <AgentConnectSearchProvider errorRoute="any-error-route" url="any-url-mock">
    <div />
    <AgentConnectSearchContext.Consumer>{contextCallback}</AgentConnectSearchContext.Consumer>
  </AgentConnectSearchProvider>
);

describe('AgentConnectSearchProvider', () => {
  it('should have called useApiGet with url', async () => {
    // when
    render(<Wrapper />);

    // then
    expect(useApiGet).toHaveBeenCalledTimes(1);
    expect(useApiGet).toHaveBeenCalledWith(expect.objectContaining({ endpoint: 'any-url-mock' }));
  });

  it('should have called useApiGet with errorPath', async () => {
    // when
    render(<Wrapper />);

    // then
    expect(useApiGet).toHaveBeenCalledTimes(1);
    expect(useApiGet).toHaveBeenCalledWith(
      expect.objectContaining({ errorPath: 'any-error-route' }),
    );
  });
});

describe('api has not yet been called', () => {
  it('should have called Consumer with default values only once', async () => {
    // when
    render(<Wrapper />);

    // then
    expect(contextCallback).toHaveBeenCalledTimes(1);
    expect(contextCallback).toHaveBeenNthCalledWith(1, defaultContextValues);
  });
});

describe('api has been called', () => {
  it('should have called AgentConnectSearchService initialize', async () => {
    // given
    jest.mocked(useApiGet).mockReturnValueOnce(apiReturnValue);

    // when
    render(<Wrapper />);

    // then
    expect(AgentConnectSearchService.initialize).toHaveBeenCalledTimes(1);
    expect(AgentConnectSearchService.initialize).toHaveBeenNthCalledWith(
      1,
      ministries,
      identityProviders,
    );
  });

  it('should have called AgentConnectSearchContext.Consumer with value only twice', async () => {
    // given
    jest.mocked(useApiGet).mockReturnValueOnce(apiReturnValue);

    // when
    render(<Wrapper />);

    // then
    expect(contextCallback).toHaveBeenCalledTimes(2);
    expect(contextCallback).toHaveBeenNthCalledWith(1, defaultContextValues);
    expect(contextCallback).toHaveBeenNthCalledWith(2, {
      ...defaultContextValues,
      payload: {
        csrfToken: 'csrf-token-mock',
        identityProviders,
        isLoaded: true,
        ministries,
        serviceProviderName: 'service-provider-name-mock',
      },
    });
  });
});

describe('when user start a search', () => {
  describe('api has yet not been called', () => {
    it('should not update consumer', async () => {
      // when
      const { getByTestId } = render(<Wrapper />);
      const button = getByTestId('valid-button');
      fireEvent.click(button);

      // then
      expect(button).toBeInTheDocument();
      expect(contextCallback).toHaveBeenCalledTimes(1);
      expect(contextCallback).toHaveBeenNthCalledWith(1, defaultContextValues);
    });
  });

  describe('api has been called', () => {
    it('should call AgentConnectSearchService.search', async () => {
      // given
      jest.mocked(useApiGet).mockReturnValueOnce(apiReturnValue);

      // when
      const { getByTestId } = render(<Wrapper />);
      const button = getByTestId('valid-button');
      fireEvent.click(button);

      // then
      expect(button).toBeInTheDocument();
      expect(AgentConnectSearchService.search).toHaveBeenCalledTimes(1);
      expect(AgentConnectSearchService.search).toHaveBeenCalledWith('this is the search term');
    });

    it('should call AgentConnectSearchService.search with empty string', async () => {
      // given
      jest.mocked(useApiGet).mockReturnValueOnce(apiReturnValue);

      // when
      const { getByTestId } = render(<Wrapper />);
      const button = getByTestId('invalid-button');
      fireEvent.click(button);

      // then
      expect(button).toBeInTheDocument();
      expect(AgentConnectSearchService.search).toHaveBeenCalledTimes(1);
      expect(AgentConnectSearchService.search).toHaveBeenCalledWith('');
    });

    it('should have update the consumer with values', async () => {
      // given
      jest.mocked(useApiGet).mockReturnValueOnce(apiReturnValue);
      jest.mocked(AgentConnectSearchService.search).mockReturnValueOnce([searchResults]);

      // when
      const { getByTestId } = render(<Wrapper />);
      const button = getByTestId('valid-button');
      fireEvent.click(button);

      // then
      expect(button).toBeInTheDocument();
      expect(contextCallback).toHaveBeenCalledTimes(3);
      expect(contextCallback).toHaveBeenNthCalledWith(1, defaultContextValues);
      expect(contextCallback).toHaveBeenNthCalledWith(2, {
        ...defaultContextValues,
        payload: {
          csrfToken: 'csrf-token-mock',
          identityProviders,
          isLoaded: true,
          ministries,
          serviceProviderName: 'service-provider-name-mock',
        },
      });
      expect(contextCallback).toHaveBeenNthCalledWith(3, {
        ...defaultContextValues,
        hasSearched: true,
        payload: {
          csrfToken: 'csrf-token-mock',
          identityProviders,
          isLoaded: true,
          ministries,
          serviceProviderName: 'service-provider-name-mock',
        },
        searchResults: [searchResults],
      });
    });
  });
});

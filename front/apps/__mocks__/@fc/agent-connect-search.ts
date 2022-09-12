import * as React from 'react';

export const AgentConnectSearchContext = React.createContext({
  hasSearched: false,
  payload: {
    csrfToken: 'csrf-token-mock',
    identityProviders: [],
    isLoaded: false,
    ministries: [],
    serviceProviderName: undefined,
  },
  searchResults: [],
  setSearchTerm: () => {},
});

export const useSearchResults = jest.fn(() => ({
  searchResults: [
    {
      identityProviders: [
        {
          active: true,
          display: true,
          name: 'mock-idp-name-1.1',
          uid: 'mock-idp-uid-1.1',
        },
        {
          active: true,
          display: true,
          name: 'mock-idp-name-1.2',
          uid: 'mock-idp-uid-1.2',
        },
      ],
      ministry: {
        id: 'mock-ministry-id-1',
        identityProviders: ['mock-idp-uid-1'],
        name: 'mock-ministry-name-1',
        sort: 1,
      },
    },
    {
      identityProviders: [
        {
          active: true,
          display: true,
          name: 'mock-idp-name-2.1',
          uid: 'mock-idp-uid-2.1',
        },
        {
          active: true,
          display: true,
          name: 'mock-idp-name-2.2',
          uid: 'mock-idp-uid-2.2',
        },
      ],
      ministry: {
        id: 'mock-ministry-id-2',
        identityProviders: ['mock-idp-uid-2'],
        name: 'mock-ministry-name-2',
        sort: 0,
      },
    },
  ],
  showNoResults: false,
  showResults: true,
}));

export const useOnSearch = jest.fn(() => jest.fn());

import { renderWithRedux } from '../../testUtils';
import SearchResultsList from './results-list';

const identityProviders = [
  {
    active: true,
    display: true,
    name: 'MOCK-IDP-NAME-0.1',
    uid: 'mock-idp-uid-0.1',
  },
  {
    active: true,
    display: true,
    name: 'MOCK-IDP-NAME-1.1',
    uid: 'mock-idp-uid-1.1',
  },
  {
    active: true,
    display: true,
    name: 'MOCK-IDP-NAME-1.2',
    uid: 'mock-idp-uid-1.2',
  },
];

const props = {
  results: [
    {
      id: 'mock-ministry-id-0',
      identityProviders: ['mock-idp-uid-0.1'],
      name: 'MOCK-MINISTRY-NAME-0',
    },
    {
      id: 'mock-ministry-id-1',
      identityProviders: ['mock-idp-uid-1.1', 'mock-idp-uid-1.2'],
      name: 'MOCK-MINISTRY-NAME-1',
    },
  ],
};

describe('SearchResultsList', () => {
  it('should render ministries names', () => {
    const { getByText } = renderWithRedux(<SearchResultsList {...props} />, {
      initialState: { identityProviders },
    });

    const firstMinistry = getByText('MOCK-MINISTRY-NAME-0');
    expect(firstMinistry).toBeInTheDocument();

    const secondMinistry = getByText('MOCK-MINISTRY-NAME-1');
    expect(secondMinistry).toBeInTheDocument();
  });

  it('should render identity providers', () => {
    const { getByText } = renderWithRedux(<SearchResultsList {...props} />, {
      initialState: { identityProviders },
    });

    const firstButton = getByText('MOCK-IDP-NAME-0.1');
    expect(firstButton).toBeInTheDocument();

    const secondButton = getByText('MOCK-IDP-NAME-1.1');
    expect(secondButton).toBeInTheDocument();

    const thirdButton = getByText('MOCK-IDP-NAME-1.2');
    expect(thirdButton).toBeInTheDocument();
  });

  describe('should render identity providers as child of ministries', () => {
    it('should render idps as childs of theirs parent ministry', () => {
      const { getByText } = renderWithRedux(<SearchResultsList {...props} />, {
        initialState: { identityProviders },
      });
      // then
      const firstMinistryList = getByText('MOCK-MINISTRY-NAME-0').closest('dl');
      const firstListByIdp = getByText('MOCK-IDP-NAME-0.1').closest('dl');
      const secondListByIdp = getByText('MOCK-IDP-NAME-1.2').closest('dl');
      // then
      expect(firstListByIdp).toEqual(firstMinistryList);
      expect(secondListByIdp).not.toEqual(firstMinistryList);
    });
  });
});

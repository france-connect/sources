import { render, renderWithRedux } from '../../testUtils';
import { Ministry } from '../../types';
import { SearchResultsComponent } from './index';

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

describe('SearchResults', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('should render nothing if search term is undefined', () => {
    // given
    const resultsMock: Ministry[] = [];
    const termMock = undefined;
    // when
    const { container } = render(<SearchResultsComponent results={resultsMock} term={termMock} />);
    // then
    expect(container.innerHTML).toBe('');
  });

  it('should render a warning string if term result is defined but has no results', () => {
    // given
    const resultsMock: Ministry[] = [];
    const termMock = 'nothing';

    // when
    const { getByText } = render(<SearchResultsComponent results={resultsMock} term={termMock} />);
    const textElement = getByText("Aucun fournisseur d'identité n'a été trouvé");
    // then
    expect(textElement).toBeInTheDocument();
  });

  it('should render a list of results', () => {
    // given
    const resultsMock: Ministry[] = [
      {
        id: 'mock-ministry-id-0',
        identityProviders: ['mock-idp-uid-0.1', 'mock-idp-uid-1.1'],
        name: 'mock-ministry-name-0',
      },
    ];
    const termMock = '';
    // when
    const { getByText } = renderWithRedux(
      <SearchResultsComponent results={resultsMock} term={termMock} />,
      {
        initialState: {
          identityProviders,
          redirectURL: '',
        },
      },
    );
    const textElement0 = getByText('MOCK-IDP-NAME-0.1');
    const textElement1 = getByText('MOCK-IDP-NAME-1.1');
    // then
    expect(textElement0).toBeInTheDocument();
    expect(textElement1).toBeInTheDocument();
  });
});

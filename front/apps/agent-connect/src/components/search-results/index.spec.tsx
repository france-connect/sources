import { render, renderWithRedux } from '../../testUtils';
import SearchResults from './index';

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
    const props = {
      results: [],
      term: undefined,
    };
    // when
    const { container } = render(<SearchResults {...props} />);
    // then
    expect(container.innerHTML).toBe('');
  });

  it('should render a warning string if term result is defined but has no results', () => {
    // given
    const props = {
      results: [],
      term: 'nothing',
    };
    // when
    const { getByText } = render(<SearchResults {...props} />);
    const textElement = getByText(
      "Aucun fournisseur d'identités n'a été trouvé",
    );
    // then
    expect(textElement).toBeInTheDocument();
  });

  it('should render lits of results', () => {
    // given
    const props = {
      results: [
        {
          id: 'mock-ministry-id-0',
          identityProviders: ['mock-idp-uid-0.1', 'mock-idp-uid-1.1'],
          name: 'mock-ministry-name-0',
        },
      ],
      term: '',
    };
    // when
    const { getByText } = renderWithRedux(<SearchResults {...props} />, {
      initialState: {
        identityProviders,
        redirectURL: '',
      },
    });
    const textElement0 = getByText('MOCK-IDP-NAME-0.1');
    const textElement1 = getByText('MOCK-IDP-NAME-1.1');
    // then
    expect(textElement0).toBeInTheDocument();
    expect(textElement1).toBeInTheDocument();
  });
});

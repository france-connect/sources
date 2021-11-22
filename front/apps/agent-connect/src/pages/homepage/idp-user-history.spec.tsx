import { renderWithRedux } from '../../testUtils';
import IdentityProvidersUserHistory from './idp-user-history';

const identityProvidersHistory = ['mock-uid-1', 'mock-uid-2'];

const initialState = {
  identityProviders: [
    {
      active: true,
      display: true,
      name: 'mock-name-1',
      uid: 'mock-uid-1',
    },
    {
      active: true,
      display: true,
      name: 'mock-name-2',
      uid: 'mock-uid-2',
    },
  ],
};

describe('IdentityProvidersUserHistory', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('should render the title of the section', () => {
    // setup
    const { getByText } = renderWithRedux(
      <IdentityProvidersUserHistory items={identityProvidersHistory} />,
      { initialState },
    );
    // action
    const titleElement = getByText("J'utilise à nouveau");
    // expect
    expect(titleElement).toBeInTheDocument();
  });

  it('should render a list with two historycard from the store', () => {
    // setup
    const { getByText } = renderWithRedux(
      <IdentityProvidersUserHistory items={identityProvidersHistory} />,
      { initialState },
    );
    // action
    const firstElement = getByText('mock-name-1');
    const secondElement = getByText('mock-name-2');
    // expect
    expect(firstElement).toBeInTheDocument();
    expect(secondElement).toBeInTheDocument();
  });
});

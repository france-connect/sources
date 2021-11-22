import * as useSearchHook from '../../hooks/use-search.hook';
import { renderWithRedux } from '../../testUtils';
import SearchComponent from './search';

let spy: any = null;

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

describe('SearchComponent', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    jest.clearAllMocks();

    spy = jest.spyOn(useSearchHook, 'useSearch');
  });

  it('should render the title of the section', () => {
    // given
    const { getByText } = renderWithRedux(<SearchComponent />, {
      initialState,
    });
    // when
    const titleElement = getByText('Je recherche mon administration');
    // then
    expect(titleElement).toBeInTheDocument();
  });

  it('should call useSearch hook', () => {
    // given
    renderWithRedux(<SearchComponent />, {
      initialState,
    });
    // then
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

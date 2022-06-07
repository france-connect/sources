import { render } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';

import { useSearchResults } from '@fc/agent-connect-search';

import { SearchResultsComponent } from './search-results.component';
import { SearchResultsListComponent } from './search-results-list.component';

jest.mock('./search-results-list.component');

describe('SearchResultsComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have called useSearchResults', () => {
    // when
    render(<SearchResultsComponent />);
    // then
    expect(useSearchResults).toHaveBeenCalledTimes(1);
  });

  it('should have shown no results element', () => {
    // given
    mocked(useSearchResults).mockReturnValue({
      searchResults: [],
      showNoResults: true,
      showResults: false,
    });
    // when
    const { getByText } = render(<SearchResultsComponent />);
    const element = getByText('Aucun fournisseur d’identité n’a été trouvé');
    // then
    expect(element).toBeInTheDocument();
  });

  it('should have not shown no results element', () => {
    // given
    mocked(useSearchResults).mockReturnValue({
      searchResults: [],
      showNoResults: false,
      showResults: false,
    });
    // when
    const { getByText } = render(<SearchResultsComponent />);
    // then
    expect(() => {
      getByText('Aucun fournisseur d’identité n’a été trouvé');
    }).toThrow();
  });

  it('should have called SearchResultsListComponent with results', () => {
    // given
    const searchResultsMock = [expect.any({}), expect.any({}), expect.any({})];
    mocked(useSearchResults).mockReturnValue({
      searchResults: searchResultsMock,
      showNoResults: false,
      showResults: true,
    });
    // when
    render(<SearchResultsComponent />);
    // then
    expect(SearchResultsListComponent).toHaveBeenCalledTimes(1);
    expect(SearchResultsListComponent).toHaveBeenCalledWith({ results: searchResultsMock }, {});
  });
});

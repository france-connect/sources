import { renderWithContext } from '@fc/tests-utils';

import { searchResults } from '../__fixtures__';
import { AgentConnectSearchContext } from '../agent-connect-search.context';
import { useSearchResults } from './use-search-results.hook';

describe('useSearchResults', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return default value while user has not yet perform a search', () => {
    // given
    const props = {
      hasSearched: false,
      payload: expect.any({}),
      searchResults: [],
      setSearchTerm: jest.fn(),
    };
    // when
    const { result } = renderWithContext(useSearchResults, AgentConnectSearchContext, props);

    // then
    expect(result.current).toStrictEqual({
      searchResults: [],
      showNoResults: false,
      showResults: false,
    });
  });

  it('should return showNoResults as false when user has perform a search and has results', () => {
    // given
    const props = {
      hasSearched: true,
      payload: expect.any({}),
      searchResults: [expect.any({}), expect.any({})],
      setSearchTerm: jest.fn(),
    };

    // when
    const { result } = renderWithContext(useSearchResults, AgentConnectSearchContext, props);

    // then
    expect(result.current).toStrictEqual({
      searchResults: [expect.any({}), expect.any({})],
      showNoResults: false,
      showResults: true,
    });
  });

  it('should return found results', () => {
    // given
    const props = {
      hasSearched: true,
      payload: expect.any({}),
      searchResults: [searchResults],
      setSearchTerm: jest.fn(),
    };

    // when
    const { result } = renderWithContext(useSearchResults, AgentConnectSearchContext, props);

    // then
    expect(result.current).toStrictEqual({
      searchResults: [searchResults],
      showNoResults: false,
      showResults: true,
    });
  });
});

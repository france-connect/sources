import { renderWithContext } from '@fc/tests-utils';

import { AgentConnectSearchContext } from '../agent-connect-search.context';
import { DEBOUNCE_DELAY_MS, useOnSearch } from './use-on-search.hook';

describe('useOnSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a function', () => {
    // when
    const { result } = renderWithContext(useOnSearch, AgentConnectSearchContext);
    // then
    expect(result.current).toBeInstanceOf(Function);
  });

  it('should setSearchTerm have been called only once with the last user inputs after 3 successive calls', async () => {
    // given
    const setSearchTermMock = jest.fn((value) => value);
    // when
    const { result, waitFor } = renderWithContext(useOnSearch, AgentConnectSearchContext, {
      setSearchTerm: setSearchTermMock,
    });
    // label HTML name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    result.current({ 'fi-search-term': 'third' });
    // label HTML name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    result.current({ 'fi-search-term': 'third ca' });
    // label HTML name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    result.current({ 'fi-search-term': 'third call' });
    // @NOTE la valeur n'a pas vocation a être modifié
    // il s'agit d'un logique utilisateur, temps de saisie/touche
    const timeout = DEBOUNCE_DELAY_MS * 3;
    // then
    await waitFor(
      () => {
        expect(setSearchTermMock).toHaveBeenCalledTimes(1);
        expect(setSearchTermMock).toHaveBeenCalledWith('third call');
      },
      { timeout },
    );
  });

  it('should setSearchTerm with a string when value is a string', async () => {
    // given
    const setSearchTermMock = jest.fn((value) => value);
    // when
    const { result, waitFor } = renderWithContext(useOnSearch, AgentConnectSearchContext, {
      setSearchTerm: setSearchTermMock,
    });
    // label HTML name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    result.current('call with an string');
    // then
    await waitFor(() => {
      expect(setSearchTermMock).toHaveBeenCalledTimes(1);
      expect(setSearchTermMock).toHaveBeenCalledWith('call with an string');
    });
  });

  it('should setSearchTerm with a string when value is an object', async () => {
    // given
    const setSearchTermMock = jest.fn((value) => value);
    // when
    const { result, waitFor } = renderWithContext(useOnSearch, AgentConnectSearchContext, {
      setSearchTerm: setSearchTermMock,
    });
    // label HTML name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    result.current({ 'fi-search-term': 'call with an object' });
    // then
    await waitFor(() => {
      expect(setSearchTermMock).toHaveBeenCalledTimes(1);
      expect(setSearchTermMock).toHaveBeenCalledWith('call with an object');
    });
  });
});

import { renderWithContext } from '@fc/tests-utils';

import { AgentConnectSearchContext } from '../agent-connect-search.context';
import { DEBOUNCE_DELAY_MS, useOnSearch } from './use-on-search.hook';

describe('useOnSearch', () => {
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
    result.current('third');
    result.current('third ca');
    result.current('third call');
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
});

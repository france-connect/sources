import debounce from 'lodash.debounce';
import { useCallback, useContext } from 'react';

import { AgentConnectSearchContext } from '../agent-connect-search.context';

// @NOTE la valeur n'a pas vocation a être modifié
// il s'agit d'un logique utilisateur, temps de saisie/touche
export const DEBOUNCE_DELAY_MS = 350;

export const useOnSearch = () => {
  const { setSearchTerm } = useContext(AgentConnectSearchContext);

  const searchHandler = useCallback(
    (value: string) => {
      setSearchTerm(value);
    },
    [setSearchTerm],
  );
  const onSearch = debounce(searchHandler, DEBOUNCE_DELAY_MS);

  return onSearch;
};

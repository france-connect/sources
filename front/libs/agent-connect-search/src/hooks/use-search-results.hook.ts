import { useContext, useEffect, useState } from 'react';

import { AgentConnectSearchContext } from '../agent-connect-search.context';

export const useSearchResults = () => {
  const { hasSearched, searchResults } = useContext(AgentConnectSearchContext);
  const [showResults, setShowResults] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);

  useEffect(() => {
    const hasResults = searchResults.length > 0;
    setShowResults(hasResults);
    setShowNoResults(hasSearched && !hasResults);
  }, [hasSearched, searchResults]);

  return { searchResults, showNoResults, showResults };
};

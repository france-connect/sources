import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

import { getSlugFromSearchTerm, searchByTerm } from '../core/search';
import { Ministry, RootState, SearchHook } from '../types';

export const useSearch = (): SearchHook => {
  const ministries = useSelector((_: RootState) => _.ministries);

  const [results, setResults] = useState<Ministry[]>([]);
  const [searchTerm, setSearchTerm] = useState<string | undefined>();

  const onFormChange = useCallback(
    (inputValue: string) => {
      setSearchTerm(inputValue);
      const slugifiedTerm = getSlugFromSearchTerm(inputValue);
      const searchResults = searchByTerm(ministries, slugifiedTerm);
      setResults(searchResults);
    },
    [ministries],
  );

  return { onFormChange, results, searchTerm };
};

export default useSearch;

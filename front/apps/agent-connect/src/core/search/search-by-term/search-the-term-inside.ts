import Fuse from 'fuse.js';

import { FuseResult, Ministry } from '../../../types';

const FUSE_SEARCH_BASE_OPTIONS = {
  findAllMatches: false,
  ignoreLocation: true,
  includeMatches: false,
  includeScore: false,
  isCaseSensitive: false,
  keys: ['slug', 'id'],
  maxPatternLength: 64,
  minMatchCharLength: 1,
  shouldSort: true,
  threshold: 0.1,
};

const searchTheTermInside =
  (term: string) =>
  (ministries: Ministry[]): FuseResult[] | [] => {
    const fuse = new Fuse(ministries, FUSE_SEARCH_BASE_OPTIONS);
    const fuseResults = fuse.search(term).sort((termA, termB) => {
      if (termA.item.name < termB.item.name || termA.item.id < termB.item.id) {
        return -1;
      }
      if (termA.item.name > termB.item.name || termA.item.id > termB.item.id) {
        return 1;
      }
      return 0;
    });
    return fuseResults;
  };

export default searchTheTermInside;

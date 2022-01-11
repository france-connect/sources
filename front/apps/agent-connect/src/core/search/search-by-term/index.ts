import { Ministry } from '../../../types';
import { pipe } from '../../functionnals';
import { addMinistrySlug } from './add-ministry-slug';
import { cleanMinistries } from './clean-ministries';
import { filterValidEntities } from './filter-valid-entities';
import { resolveFuseItems } from './resolve-fuse-items';
import { searchTheTermInside } from './search-the-term-inside';

const WHITESPACE_CHAR = ' ';

export const searchByTerm = (ministries: Ministry[], searchTerm: string): Ministry[] | [] => {
  const term = searchTerm.split(WHITESPACE_CHAR).filter(Boolean).join(WHITESPACE_CHAR);

  const results = pipe(
    addMinistrySlug,
    searchTheTermInside(term),
    resolveFuseItems,
    filterValidEntities,
    cleanMinistries,
  )(ministries);

  return results;
};

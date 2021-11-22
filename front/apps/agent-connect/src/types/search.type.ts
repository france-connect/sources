/* istanbul ignore file */

// declarative file
import { Ministry } from './ministry.type';

export type FuseResult = {
  item: Ministry;
  refIndex: Number;
};

export type SearchHook = {
  results: Ministry[];
  searchTerm: string | undefined;
  onFormChange: Function;
};

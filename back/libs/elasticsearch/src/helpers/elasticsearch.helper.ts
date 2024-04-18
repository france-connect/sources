import { EVENT_MAPPING } from '@fc/csmr-tracks/constants';

/**
 * add 'AND' logic to params for ES Query
 * @param {Array<Object>} list list of params to format
 */
export const and = (list: unknown[]) => ({
  bool: {
    must: list,
  },
});

/**
 * add 'OR' logic to params for ES Query
 * @param {Array<Object>} list list of params to format
 */
export const or = (list: unknown[]) => ({
  bool: {
    should: list,
  },
});

type orCriteria = {
  bool: {
    should: unknown[];
  };
};
type andCriteria = {
  bool: {
    must: unknown[];
  };
};
type andNotCriteria = {
  bool: {
    must: unknown[];
    // es naming convention
    // eslint-disable-next-line @typescript-eslint/naming-convention
    must_not?: unknown[];
  };
};
export type multiMatchEsCriteria = andCriteria | orCriteria;
/**
 * build ES query for complex list multimatching
 * @param list list of field and their value to add to query
 * @param mandatory And or Or ?
 *
 * @see look at the UT will help to understand to complex structure
 */
export function formatMultiMatchGroup(
  list = [],
  mandatory = false,
): multiMatchEsCriteria {
  const results = list
    .map((matches) => Object.entries(matches))
    .map((fields) =>
      and(
        // Fastest and more readable way of writing this
        // then spreading the code into sub-function
        // eslint-disable-next-line max-nested-callbacks
        fields.map((field) => ({
          term: Object.fromEntries([field]),
        })),
      ),
    );

  return mandatory ? and(results) : or(results);
}

export function formatV2Query(event: string): andNotCriteria {
  const query: andNotCriteria = { bool: { must: [{ term: { event } }] } };
  if (event === EVENT_MAPPING['checkedToken/verification']) {
    // es naming convention
    // eslint-disable-next-line @typescript-eslint/naming-convention
    query.bool.must_not = [{ term: { scope: '' } }];
  }
  return query;
}

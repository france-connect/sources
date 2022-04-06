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

type andCriteria = {
  bool: {
    should: unknown[];
  };
};
type orCriteria = {
  bool: {
    must: unknown[];
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

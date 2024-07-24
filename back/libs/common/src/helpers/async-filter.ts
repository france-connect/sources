import { deprecate } from 'util';

async function oldAsyncFilter<T>(arr, predicate): Promise<T> {
  const results = await Promise.all(arr.map(predicate));
  return arr.filter((_v, index) => results[index]);
}

/**
 * @deprecated This function is deprecated. Use the one from "array-sync.helper.ts" instead.
 * @ticket FC-1737
 * @author sherman
 */
const asyncFilter = deprecate(
  oldAsyncFilter,
  'This function is deprecated. Use "ArrayAsyncHelper.filterAsync" from "@fc/common" instead.',
);

export { asyncFilter };

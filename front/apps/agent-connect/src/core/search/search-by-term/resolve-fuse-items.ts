import { FuseResult, Ministry } from '../../../types';

export const resolveFuseItems = (results: FuseResult[]): Ministry[] => {
  const resolved = results.map((fuseResult) => fuseResult.item);
  return resolved;
};

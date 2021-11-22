import { FuseResult, Ministry } from '../../../types';

const resolveFuseItems = (results: FuseResult[]): Ministry[] => {
  const resolved = results.map(fuseResult => fuseResult.item);
  return resolved;
};

export default resolveFuseItems;

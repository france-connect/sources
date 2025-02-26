import get from 'lodash.get';

import { SortOrder } from '../../../enums';

export const sortByKey =
  <T, U = unknown, V = unknown>(
    key: string,
    order: SortOrder = SortOrder.ASC,
    transformer?: (prop: U) => V,
  ) =>
  (a: T, b: T) => {
    let aprop = get(a, key);
    let bprop = get(b, key);
    if (transformer) aprop = transformer(aprop);
    if (transformer) bprop = transformer(bprop);

    if (order === SortOrder.DESC) {
      [aprop, bprop] = [bprop, aprop];
    }

    if (aprop > bprop) return 1;
    if (aprop < bprop) return -1;
    return 0;
  };

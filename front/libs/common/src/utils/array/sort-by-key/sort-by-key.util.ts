import get from 'lodash.get';

export const sortByKey =
  <T, U = unknown, V = unknown>(key: string, transformer?: (prop: U) => V) =>
  (a: T, b: T) => {
    let aprop = get(a, key);
    let bprop = get(b, key);
    if (transformer) aprop = transformer(aprop);
    if (transformer) bprop = transformer(bprop);
    if (aprop > bprop) return 1;
    if (aprop < bprop) return -1;
    return 0;
  };

import type { GlobalState, PersistList } from '../interfaces';

export const getPersistLists = <S extends GlobalState>(states: S): PersistList => {
  const keys = Object.keys(states);
  const lists = keys.reduce(
    (acc: PersistList, key: string) => {
      const state = states[key];
      const next = state.blacklist
        ? { blacklist: [...acc.blacklist, key] }
        : { whitelist: [...acc.whitelist, key] };
      const merged = { ...acc, ...next };
      return merged;
    },
    { blacklist: [], whitelist: [] },
  );
  return lists;
};

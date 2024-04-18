import type { GlobalState, InitialState } from './interfaces';

/** @see file ./interfaces/initial-state.ts */
export const getInitialState = <S extends GlobalState, IS extends InitialState = InitialState>(
  states: S,
): IS => {
  const keys = Object.keys(states);
  const result = keys.reduce((acc, key) => {
    const next = { [key]: states[key].defaultValue };
    const merged = { ...acc, ...next };
    return merged;
  }, {} as IS);

  return result;
};

import { createSelector } from 'reselect';

import { RootState } from '../../types';

const getValueFromStore = (state: RootState) => state.value;

export const selectAnythingFromStore = createSelector(
  getValueFromStore,
  valueFromStore => {
    const memoizedValue = valueFromStore;
    return memoizedValue;
  },
);

export default selectAnythingFromStore;

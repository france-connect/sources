import { createCachedSelector } from 're-reselect';

import { RootState } from '../../types';

const getValueFromStore = (state: RootState) => state.value;
const getPassedProps = (_state: RootState, uid: string) => uid;

export const selectAnythingFromStoreWithAProps = createCachedSelector(
  getValueFromStore,
  getPassedProps,
  (valueFromStore, passsedProps) => {
    const memoizedValue = { valueFromStore, passsedProps };
    return memoizedValue;
  },
)(
  (_state, passsedProps) =>
    `any::string::selector::identifier::${passsedProps}`,
);

export default selectAnythingFromStoreWithAProps;

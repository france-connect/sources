/* istanbul ignore file */

// declarative file
import { ReducersMapObject } from 'redux';

import { servicesProvidersReducers } from '@fc/partners';

export const reducersMap: ReducersMapObject = {
  ...servicesProvidersReducers,
};

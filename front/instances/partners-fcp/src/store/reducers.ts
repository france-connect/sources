/* istanbul ignore file */

// declarative file
import { ReducersMapObject } from 'redux';

import { servicesProvidersReducers } from '@fc/service-providers';

export const reducersMap: ReducersMapObject = {
  ...servicesProvidersReducers,
};

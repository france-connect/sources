/* istanbul ignore file */

// Declarative code
import { IEventMap } from '@fc/tracking';

import { EventsCategories, UserDashboardBackRoutes } from './enums';

export function getEventsMap(urlPrefix: string): IEventMap {
  return {
    DISPLAYED_USER_TRACKS: {
      category: EventsCategories.USER_TRACKS,
      event: 'DISPLAYED',
      exceptions: [],
      route: `${urlPrefix}${UserDashboardBackRoutes.TRACKS}`,
      intercept: false,
    },
    DISPLAYED_USER_PREFERENCES: {
      category: EventsCategories.USER_PREFERENCES,
      event: 'DISPLAYED',
      exceptions: [],
      route: '',
      intercept: false,
    },
    UPDATED_USER_PREFERENCES: {
      category: EventsCategories.USER_PREFERENCES,
      event: 'UPDATED',
      exceptions: [],
      route: '',
      intercept: false,
    },
    UPDATED_USER_PREFERENCES_IDP: {
      category: EventsCategories.USER_PREFERENCES,
      event: 'UPDATED_IDP',
      exceptions: [],
      route: '',
      intercept: false,
    },
    UPDATED_USER_PREFERENCES_FUTURE_IDP: {
      category: EventsCategories.USER_PREFERENCES,
      event: 'UPDATED_FUTURE_IDP',
      exceptions: [],
      route: '',
      intercept: false,
    },
  };
}

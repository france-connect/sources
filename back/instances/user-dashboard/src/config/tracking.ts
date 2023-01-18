/* istanbul ignore file */

// Tested by DTO
import { TrackingConfig } from '@fc/tracking';
import { EventsCategories } from '@fc/user-dashboard';

export default {
  eventsMap: {
    DISPLAYED_USER_TRACKS: {
      category: EventsCategories.USER_TRACKS,
      event: 'DISPLAYED',
    },
    DISPLAYED_USER_PREFERENCES: {
      category: EventsCategories.USER_PREFERENCES,
      event: 'DISPLAYED',
    },

    UPDATED_USER_PREFERENCES: {
      category: EventsCategories.USER_PREFERENCES,
      event: 'UPDATED',
    },

    UPDATED_USER_PREFERENCES_IDP: {
      category: EventsCategories.USER_PREFERENCES,
      event: 'UPDATED_IDP',
    },

    UPDATED_USER_PREFERENCES_FUTURE_IDP: {
      category: EventsCategories.USER_PREFERENCES,
      event: 'UPDATED_FUTURE_IDP',
    },
  },
} as TrackingConfig;

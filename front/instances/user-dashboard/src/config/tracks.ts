import type { TracksConfig } from '@fc/tracks';

// API URLs

export const Tracks: TracksConfig = {
  endpoints: {
    tracks: '/api/traces',
  },
  luxon: {
    datetimeShortFrFormat: "D 'à' T",
    dayFormat: 'DDD',
    monthYearFormat: 'LLLL yyyy',
  },
};

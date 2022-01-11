import { DateTime } from 'luxon';

export const createUniqueGroupKeyFromTrackDate = jest.fn(() =>
  DateTime.fromObject({
    month: 11,
    year: 2021,
  }).toMillis(),
);

export const groupTracksByMonth = jest.fn(() => () => [
  [
    '202110',
    {
      label: 'Octobre 2021',
      tracks: [
        {
          accountId: 'mock-accountId-1',
          city: 'mock-city-1',
          country: 'mock-country-1',
          date: '2021-10-05T14:48:00.000Z',
          datetime: DateTime.fromISO('2021-10-05T14:48:00.000Z'),
          event: 'mock-event-1',
          spAcr: 'mock-spacr-1',
          spId: 'mock-spid-1',
          spName: 'mock-spname-1',
          trackId: 'mock-trackid-1',
        },
      ],
    },
  ],
  [
    '202111',
    {
      label: 'Novembre 2021',
      tracks: [
        {
          accountId: 'mock-accountId-2',
          city: 'mock-city-2',
          country: 'mock-country-2',
          date: '2021-11-05T14:48:00.000Z',
          datetime: DateTime.fromISO('2021-11-05T14:48:00.000Z'),
          event: 'mock-event-2',
          spAcr: 'mock-spacr-2',
          spId: 'mock-spid-2',
          spName: 'mock-spname-2',
          trackId: 'mock-trackid-2',
        },
      ],
    },
  ],
]);

export const orderGroupByKeyAsc = jest.fn(() => true);

export const orderTracksByDateDesc = jest.fn(() => true);

export const transformTrackToEnhanced = jest.fn((item) => item);

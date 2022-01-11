import { render } from '@testing-library/react';
import { DateTime } from 'luxon';
import { mocked } from 'ts-jest/utils';

import { useApiGet } from '@fc/common';

import { orderGroupByKeyAsc, transformTrackToEnhanced } from '../../utils';
import { TracksGroupComponent } from './tracks-group';
import { TracksListComponent } from './tracks-list.component';

jest.mock('@fc/common');
jest.mock('./tracks-group');
jest.mock('./../../utils/tracks.util');

const tracks = [
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
];

describe('TracksListComponent', () => {
  const useApiGetMock = mocked(useApiGet);
  useApiGetMock.mockReturnValue(tracks);

  const options = {
    API_ROUTE_TRACKS: 'mock_API_ROUTE_TRACKS',
    API_ROUTE_USER_INFOS: 'mock_API_ROUTE_USER_INFOS',
    LUXON_FORMAT_DAY: 'DDD',
    LUXON_FORMAT_HOUR_MINS: 'T',
    LUXON_FORMAT_MONTH_YEAR: 'LLLL yyyy',
    LUXON_FORMAT_TIMEZONE: 'z',
  };

  it('should have called useApiGet hook', () => {
    // given
    render(<TracksListComponent options={options} />);
    // then
    expect(useApiGetMock).toHaveBeenCalled();
  });

  it('should have called transformTrackToEnhanced', () => {
    // given
    render(<TracksListComponent options={options} />);
    // then
    expect(transformTrackToEnhanced).toHaveBeenCalled();
    expect(transformTrackToEnhanced).toHaveBeenNthCalledWith(1, tracks[0], 0, tracks);
    expect(transformTrackToEnhanced).toHaveBeenNthCalledWith(2, tracks[1], 1, tracks);
  });

  it('should have called orderGroupByKeyAsc', () => {
    // given
    render(<TracksListComponent options={options} />);
    // then
    expect(orderGroupByKeyAsc).toHaveBeenCalled();
  });

  it('should have called TracksGroupComponent', () => {
    // given
    render(<TracksListComponent options={options} />);
    // then
    expect(TracksGroupComponent).toHaveBeenCalled();
    expect(TracksGroupComponent).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        label: 'Octobre 2021',
        options,
        tracks: [tracks[0]],
      }),
      {},
    );
    expect(TracksGroupComponent).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        label: 'Novembre 2021',
        options,
        tracks: [tracks[1]],
      }),
      {},
    );
  });
});

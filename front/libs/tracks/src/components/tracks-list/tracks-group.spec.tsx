import { render } from '@testing-library/react';
import { DateTime } from 'luxon';

import { EidasToLabel } from '../../enums';
import { EnhancedTrack } from '../../interfaces';
import * as TrackUtils from '../../utils/tracks.util';
import { TrackCardComponent } from '../track-card/track-card.component';
import { TracksGroupComponent } from './tracks-group';

jest.mock('./../track-card/track-card.component');

describe('tracksGroupComponent', () => {
  const options = {
    API_ROUTE_TRACKS: 'mock_API_ROUTE_TRACKS',
    API_ROUTE_USER_INFOS: 'mock_API_ROUTE_USER_INFOS',
    LUXON_FORMAT_DAY: 'DDD',
    LUXON_FORMAT_HOUR_MINS: 'T',
    LUXON_FORMAT_MONTH_YEAR: 'LLLL yyyy',
    LUXON_FORMAT_TIMEZONE: 'z',
  };
  const oldestTrack: EnhancedTrack = {
    city: 'any',
    claims: null,
    country: 'any',
    datetime: DateTime.fromObject({ day: 1, month: 10, year: 2021 }),
    event: 'any',
    idpName: 'any',
    platform: 'FranceConnect',
    spAcr: 'any' as keyof typeof EidasToLabel,
    spName: 'any',
    time: 1633042800000, // '2021-10-01T00:00:00.000+01:00',
    trackId: 'oldest track',
  };
  const newestTrack: EnhancedTrack = {
    city: 'any',
    claims: null,
    country: 'any',
    datetime: DateTime.fromObject({ day: 1, month: 11, year: 2021 }),
    event: 'any',
    idpName: 'any',
    platform: 'FranceConnect',
    spAcr: 'any' as keyof typeof EidasToLabel,
    spName: 'any',
    time: 1635721200000, // '2021-11-01T00:00:00.000+01:00',
    trackId: 'newest track',
  };
  const allTracks = [oldestTrack, newestTrack];

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should render the defined label', () => {
    // given
    const { getByText, unmount } = render(
      <TracksGroupComponent label="Any Label" options={options} tracks={allTracks} />,
    );
    // then
    const element = getByText('Any Label');
    expect(element).toBeInTheDocument();
    unmount();
  });

  it('orderTracksByDateDesc should have been called', () => {
    // given
    const sortFunctionSpy = jest.spyOn(TrackUtils, 'orderTracksByDateDesc');
    const { unmount } = render(
      <TracksGroupComponent label="Any Label" options={options} tracks={allTracks} />,
    );
    // then
    expect(sortFunctionSpy).toHaveBeenCalled();
    unmount();
  });

  it('trackCardComponent should have been called 2 times', () => {
    // given
    const { unmount } = render(
      <TracksGroupComponent label="Any Label" options={options} tracks={allTracks} />,
    );
    // then
    expect(TrackCardComponent).toHaveBeenCalledTimes(2);
    unmount();
  });

  it('trackCardComponent should have been sorted by tracks.time', () => {
    // given
    const { unmount } = render(
      <TracksGroupComponent label="Any Label" options={options} tracks={allTracks} />,
    );
    // then
    expect(TrackCardComponent).toHaveBeenNthCalledWith(1, { options, track: newestTrack }, {});
    unmount();
  });
});
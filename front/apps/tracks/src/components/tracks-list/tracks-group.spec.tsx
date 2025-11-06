import { render } from '@testing-library/react';
import { DateTime } from 'luxon';

import { Platforms } from '@fc/common';

import type { CinematicEvents, EidasToLabel } from '../../enums';
import type { EnhancedTrackInterface } from '../../interfaces';
import * as TrackUtils from '../../utils/tracks.util';
import { TrackCardComponent } from '../track-card/track-card.component';
import { TracksGroupComponent } from './tracks-group';

jest.mock('./../track-card/track-card.component');

describe('tracksGroupComponent', () => {
  const oldestTrack: EnhancedTrackInterface = {
    authenticationEventId: 'any',
    city: 'any',
    claims: [],
    country: 'any',
    datetime: DateTime.fromObject({ day: 1, month: 10, year: 2021 }),
    event: 'any' as CinematicEvents,
    idpLabel: 'any',
    interactionAcr: 'any' as keyof typeof EidasToLabel,
    platform: Platforms.FranceConnect,
    spLabel: 'any',
    time: 1633042800000,
    // '2021-10-01T00:00:00.000+01:00',
    trackId: 'oldest track',
  };
  const newestTrack: EnhancedTrackInterface = {
    authenticationEventId: 'any',
    city: 'any',
    claims: [],
    country: 'any',
    datetime: DateTime.fromObject({ day: 1, month: 11, year: 2021 }),
    event: 'any' as CinematicEvents,
    idpLabel: 'any',
    interactionAcr: 'any' as keyof typeof EidasToLabel,
    platform: Platforms.FranceConnect,
    spLabel: 'any',
    time: 1635721200000,
    // '2021-11-01T00:00:00.000+01:00',
    trackId: 'newest track',
  };
  const allTracks = [oldestTrack, newestTrack];

  it('should render the defined label', () => {
    // Given
    const { getByText } = render(<TracksGroupComponent label="Any Label" tracks={allTracks} />);
    // Then
    const element = getByText('Any Label');

    expect(element).toBeInTheDocument();
  });

  it('orderTracksByDateDesc should have been called', () => {
    // Given
    const sortFunctionSpy = jest.spyOn(TrackUtils, 'orderTracksByDateDesc');
    render(<TracksGroupComponent label="Any Label" tracks={allTracks} />);

    // Then
    expect(sortFunctionSpy).toHaveBeenCalledOnce();
  });

  it('trackCardComponent should have been called 2 times', () => {
    // Given
    render(<TracksGroupComponent label="Any Label" tracks={allTracks} />);

    // Then
    expect(TrackCardComponent).toHaveBeenCalledTimes(2);
  });

  it('trackCardComponent should have been sorted by tracks.time', () => {
    // Given
    render(<TracksGroupComponent label="Any Label" tracks={allTracks} />);

    // Then
    expect(TrackCardComponent).toHaveBeenNthCalledWith(1, { track: newestTrack }, undefined);
  });
});

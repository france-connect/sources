import { ucfirst } from '@fc/common';

import type { EnhancedTrackInterface } from '../../interfaces';
import { orderTracksByDateDesc } from '../../utils';
import { TrackCardComponent } from '../track-card/track-card.component';

export type TracksMonthGroupProps = {
  label: string;
  tracks: EnhancedTrackInterface[];
};

export const TracksGroupComponent = ({ label, tracks }: TracksMonthGroupProps) => (
  <section className="fr-mb-5w">
    <h2 className="fr-h4 fr-pb-3v fr-mb-2w">
      <b>{ucfirst(label)}</b>
    </h2>
    {tracks.sort(orderTracksByDateDesc).map((track: EnhancedTrackInterface) => (
      <TrackCardComponent key={track.trackId} track={track} />
    ))}
  </section>
);

TracksGroupComponent.displayName = 'TracksMonthGroupComponent';

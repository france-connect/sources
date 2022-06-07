import { ucfirst } from '@fc/common';

import { EnhancedTrack, TracksConfig } from '../../interfaces';
import { orderTracksByDateDesc } from '../../utils';
import { TrackCardComponent } from '../track-card/track-card.component';

export type TracksMonthGroupProps = {
  label: string;
  tracks: EnhancedTrack[];
  options: TracksConfig;
};

export const TracksGroupComponent = ({ label, options, tracks }: TracksMonthGroupProps) => (
  <section className="fr-mb-5w">
    <h2 className="fr-h6 fr-pb-3v fr-mb-2w">
      <b>{ucfirst(label)}</b>
    </h2>
    {tracks.sort(orderTracksByDateDesc).map((track: EnhancedTrack) => (
      <TrackCardComponent key={track.trackId} options={options} track={track} />
    ))}
  </section>
);

TracksGroupComponent.displayName = 'TracksMonthGroupComponent';

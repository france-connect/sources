import { ucfirst } from '@fc/common';
import { EnhancedTrack, TracksConfig } from '../../interfaces';
import { orderTracksByDateAsc } from '../../utils';
import { TrackCardComponent } from '../track-card/track-card.component';

export type TracksMonthGroupProps = {
  label: string;
  tracks: EnhancedTrack[];
  options: TracksConfig;
};

export const TracksGroupComponent = ({
  label,
  tracks,
  options,
}: TracksMonthGroupProps) => (
  <section className="mb40">
    <h6 className="pb12 mb16">
      <b>{ucfirst(label)}</b>
    </h6>
    {tracks.sort(orderTracksByDateAsc).map((track: EnhancedTrack) => (
      <TrackCardComponent key={track.trackId} track={track} options={options} />
    ))}
  </section>
);

TracksGroupComponent.displayName = 'TracksMonthGroupComponent';

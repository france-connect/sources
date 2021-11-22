import { useApiGet } from '@fc/common';

import { TracksGroupComponent } from './tracks-group';
import {
  groupTracksByMonth,
  orderGroupByKeyAsc,
  transformTrackToEnhanced,
} from '../../utils';
import { Track, TrackList, TracksConfig } from '../../interfaces';

export type TracksListComponentProps = {
  options: TracksConfig;
};

export const TracksListComponent = ({ options }: TracksListComponentProps) => {
  const tracks = useApiGet<Track[]>({
    endpoint: options.API_ROUTE_TRACKS,
  });

  return (
    <div className="mt40">
      {tracks &&
        tracks
          .map(transformTrackToEnhanced)
          .reduce(groupTracksByMonth.bind(null, options), [])
          .sort(orderGroupByKeyAsc)
          .map(([key, { label, tracks: items }]: TrackList) => (
            <TracksGroupComponent
              key={key}
              label={label}
              tracks={items}
              options={options}
            />
          ))}
    </div>
  );
};

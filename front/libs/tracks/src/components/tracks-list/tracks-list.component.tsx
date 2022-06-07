import { useApiGet } from '@fc/common';

import { Track, TrackList, TracksConfig } from '../../interfaces';
import { groupTracksByMonth, orderGroupByKeyAsc, transformTrackToEnhanced } from '../../utils';
import { TracksGroupComponent } from './tracks-group';

export type TracksListComponentProps = {
  options: TracksConfig;
};

export const TracksListComponent = ({ options }: TracksListComponentProps) => {
  const tracks = useApiGet<Track[]>({
    endpoint: options.API_ROUTE_TRACKS,
  });

  return (
    <div className="fr-mt-5w" id="tracks-list">
      {tracks &&
        tracks
          .map(transformTrackToEnhanced)
          .reduce(groupTracksByMonth(options), [])
          .sort(orderGroupByKeyAsc)
          .map(([tracksGroupKey, { label, tracks: items }]: TrackList) => (
            <TracksGroupComponent
              key={tracksGroupKey}
              label={label}
              options={options}
              tracks={items}
            />
          ))}
    </div>
  );
};

import React, { useCallback } from 'react';
import { useNavigate } from 'react-router';

import { ConfigService } from '@fc/config';
import { PaginationComponent } from '@fc/dsfr';

import { TracksOptions } from '../../enums';
import type { PaginationResultInterface, TrackListType, TracksConfig } from '../../interfaces';
import { groupTracksByMonth, orderGroupByKeyAsc, transformTrackToEnhanced } from '../../utils';
import { TracksGroupComponent } from './tracks-group';
import { usePaginatedTracks } from './use-paginated-tracks.hook';

const NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION = 3;

export const TracksListComponent = React.memo(() => {
  const {
    luxon: { monthYearFormat },
  } = ConfigService.get<TracksConfig>(TracksOptions.CONFIG_NAME);

  const navigate = useNavigate();

  const { tracks } = usePaginatedTracks();

  const onPageClickHandler = useCallback(
    (offset: number) => {
      const { size } = tracks.meta as PaginationResultInterface;
      const location = new URLSearchParams({
        offset: String(offset),
        size: String(size),
      });
      /* @TODO create an util in lib/common in order to transforme the URLSearchParams */
      navigate(`/history?${location.toString()}`);
    },
    [tracks, navigate],
  );

  return (
    <div className="fr-mt-5w" id="tracks-list">
      {tracks.payload
        ?.filter(Boolean)
        .map(transformTrackToEnhanced)
        .reduce(groupTracksByMonth(monthYearFormat), [])
        .sort(orderGroupByKeyAsc)
        .map(([tracksGroupKey, { label, tracks: items }]: TrackListType) => (
          <TracksGroupComponent key={tracksGroupKey} label={label} tracks={items} />
        ))}
      <div className="flex-columns flex-center" id="tracks-pagination">
        {!!tracks.meta?.total && (
          <PaginationComponent
            useEdgeArrows
            useEllipsis
            useNavArrows
            numberOfPagesShownIntoNavigation={NUMBER_OF_PAGES_SHOWN_INTO_NAVIGATION}
            pagination={{
              offset: tracks.meta.offset,
              size: tracks.meta.size,
              total: tracks.meta.total,
            }}
            onPageClick={onPageClickHandler}
          />
        )}
      </div>
    </div>
  );
});

TracksListComponent.displayName = 'TracksListComponent';

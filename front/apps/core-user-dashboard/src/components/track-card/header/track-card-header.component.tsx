import React from 'react';

import type { TrackInterface } from '../../../interfaces';

interface TrackCardConnexionHeaderComponentProps {
  track: TrackInterface;
}

export const TrackCardConnexionHeaderComponent = React.memo(
  ({ track }: TrackCardConnexionHeaderComponentProps) => (
    <div className="fr-mb-2w flex-columns flex-between items-center">
      <div>
        <h4
          className="fr-text--lg fr-text-title--blue-france fr-mb-0"
          data-testid="TrackCardHeaderComponent-spName">
          {track.spLabel}
        </h4>
      </div>
    </div>
  ),
);

TrackCardConnexionHeaderComponent.displayName = 'TrackCardConnexionHeaderComponent';

import classnames from 'classnames';
import React from 'react';

import type { TrackInterface } from '../../interfaces';
import { TrackCardConnexionDetailsComponent } from './connection-details';
import { TrackCardConnexionHeaderComponent } from './header';

interface TrackCardComponentProps {
  track: TrackInterface;
  isLast?: boolean;
}

export const TrackCardComponent = React.memo(
  ({ isLast = false, track }: TrackCardComponentProps) => (
    <div
      className={classnames('fr-border-default--blue-france fr-p-5w', {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'fr-mb-2w': !isLast,
      })}
      data-testid="TrackCardComponent">
      <TrackCardConnexionHeaderComponent track={track} />
      <TrackCardConnexionDetailsComponent track={track} />
    </div>
  ),
);

TrackCardComponent.displayName = 'TrackCardComponent';

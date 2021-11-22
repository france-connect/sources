import classnames from 'classnames';
import React, { useCallback, useState } from 'react';

import { EnhancedTrack, TracksConfig } from '../../interfaces';
import CardBadge from './card-badge.component';
import CardContent from './card-content.component';
import CardHeader from './card-header.component';

import './index.scss';

export interface TrackCardProps {
  track: EnhancedTrack;
  options: TracksConfig;
}

export const TrackCardComponent = React.memo(
  ({ track, options }: TrackCardProps) => {
    const [opened, setOpened] = useState(false);

    const openCardHandler = useCallback(() => {
      const next = !opened;
      setOpened(next);
    }, [opened]);

    const { accountId, datetime, event, spAcr, spName, trackId } = track;

    // @TODO ajuster quand on aura récupérer l'origine/source des traces
    const isFromFranceConnectPlus = false;

    const cardA11YId = `card::a11y::${trackId}`;
    return (
      <button
        aria-controls={cardA11YId}
        aria-expanded={opened}
        className={classnames(
          'card',
          'use-pointer is-full-width text-left is-block is-relative is-blue-shadow mb32 px20 py16',
        )}
        type="button"
        onClick={openCardHandler}
      >
        <CardBadge fromFcPlus={isFromFranceConnectPlus} type={event} />
        <CardHeader
          datetime={datetime}
          identityProviderName={spName}
          opened={opened}
          options={options}
        />
        <CardContent
          accessibleId={cardA11YId}
          accountId={accountId}
          datetime={datetime}
          opened={opened}
          spAcr={spAcr}
          options={options}
        />
      </button>
    );
  },
);

TrackCardComponent.displayName = 'TrackCardComponent';

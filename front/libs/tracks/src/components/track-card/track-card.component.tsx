import './track-card.scss';

import classnames from 'classnames';
import React, { useCallback, useState } from 'react';

import { EnhancedTrack, TracksConfig } from '../../interfaces';
import { TrackCardBadgeComponent } from './card-badge.component';
import { TrackCardContentComponent } from './card-content.component';
import { TrackCardHeaderComponent } from './card-header.component';

export interface TrackCardProps {
  track: EnhancedTrack;
  options: TracksConfig;
}

export const TrackCardComponent = React.memo(({ options, track }: TrackCardProps) => {
  const [opened, setOpened] = useState(false);

  const openCardHandler = useCallback(() => {
    const next = !opened;
    setOpened(next);
  }, [opened]);

  const { accountId, datetime, event, spAcr, spName, trackId } = track;

  // @TODO ajuster quand on aura récupérer l'origine/source des traces
  const isFromFranceConnectPlus = true;

  const cardA11YId = `card::a11y::${trackId}`;
  return (
    <button
      aria-controls={cardA11YId}
      aria-expanded={opened}
      className={classnames(
        'card',
        'use-pointer is-full-width text-left is-block is-relative is-blue-shadow mb32 px20 py16',
      )}
      data-testid={trackId}
      type="button"
      onClick={openCardHandler}>
      <TrackCardBadgeComponent fromFcPlus={isFromFranceConnectPlus} type={event} />
      <TrackCardHeaderComponent
        datetime={datetime}
        identityProviderName={spName}
        opened={opened}
        options={options}
      />
      <TrackCardContentComponent
        accessibleId={cardA11YId}
        accountId={accountId}
        datetime={datetime}
        opened={opened}
        options={options}
        spAcr={spAcr}
      />
    </button>
  );
});

TrackCardComponent.displayName = 'TrackCardComponent';

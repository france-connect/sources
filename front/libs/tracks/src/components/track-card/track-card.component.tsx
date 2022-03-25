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

  const { city, claims, country, datetime, event, platform, spAcr, spName, trackId } = track;

  /**
   * @todo #820
   * add real management for the entity name : FranceConnect or FranceConnect+
   *
   * Author: Arnaud PSA
   * Date: 10/02/2022
   */
  const isFromFranceConnectPlus = platform === 'FranceConnect+';

  const cardA11YId = `card::a11y::${trackId}`;
  return (
    <button
      aria-controls={cardA11YId}
      aria-expanded={opened}
      className={classnames(
        'card',
        `track-${platform}`,
        'use-pointer is-full-width text-left is-block is-relative is-blue-shadow mb32 px20 py16',
      )}
      data-testid={trackId}
      data-time={datetime}
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
        city={city}
        claims={claims}
        country={country}
        datetime={datetime}
        opened={opened}
        spAcr={spAcr}
      />
    </button>
  );
});

TrackCardComponent.displayName = 'TrackCardComponent';

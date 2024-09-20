import classnames from 'classnames';
import React from 'react';
import { useToggle } from 'usehooks-ts';

import type { EnhancedTrackInterface, TracksConfig } from '../../interfaces';
import { TrackCardBadgeComponent } from './card-badge.component';
import { TrackCardContentComponent } from './card-content.component';
import { TrackCardHeaderComponent } from './card-header.component';

export const MISSING_SP_LABEL_VALUE = 'Nom du service non défini';

interface TrackCardProps {
  track: EnhancedTrackInterface;
  options: TracksConfig;
}

export const TrackCardComponent = React.memo(({ options, track }: TrackCardProps) => {
  const [opened, toggleOpened] = useToggle(false);

  const {
    city,
    claims,
    country,
    datetime,
    event: eventType,
    idpLabel,
    interactionAcr,
    platform,
    spLabel,
    trackId,
  } = track;

  /**
   * @todo #820
   * add real management for the entity name : FranceConnect or FranceConnect+
   *
   * Author: Arnaud PSA
   * Date: 10/02/2022
   */
  const isFromFranceConnectPlus = platform === 'FranceConnect+';

  const cardId = `track::card::${trackId}`;
  const dataTestId = `${platform}-${trackId}`;
  return (
    <button
      key={cardId}
      aria-controls={cardId}
      aria-expanded={opened}
      aria-label="Voir les détails"
      className={classnames(
        'is-full-width text-left is-block is-relative is-blue-shadow fr-mb-4w fr-px-5v fr-py-2w',
      )}
      data-testid={dataTestId}
      data-time={datetime}
      type="button"
      onClick={toggleOpened}>
      <TrackCardBadgeComponent fromFcPlus={isFromFranceConnectPlus} type={eventType} />
      <TrackCardHeaderComponent
        datetime={datetime}
        opened={opened}
        options={options}
        serviceProviderLabel={spLabel || MISSING_SP_LABEL_VALUE}
      />

      <TrackCardContentComponent
        accessibleId={cardId}
        city={city}
        claims={claims}
        country={country}
        datetime={datetime}
        eventType={eventType}
        idpLabel={idpLabel}
        interactionAcr={interactionAcr}
        opened={opened}
        options={options}
      />
    </button>
  );
});

TrackCardComponent.displayName = 'TrackCardComponent';

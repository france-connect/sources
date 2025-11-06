import type { DateTime } from 'luxon';
import React from 'react';

import { ConfigService } from '@fc/config';

import { EidasToLabel, TracksOptions } from '../../enums';
import type { TracksConfig } from '../../interfaces';

type TrackCardConnectionProps = {
  city: string | undefined;
  country: string | undefined;
  datetime: DateTime;
  idpLabel: string;
  interactionAcr: keyof typeof EidasToLabel;
  authenticationEventId: string;
};

export const ConnectionComponent = React.memo(
  ({
    authenticationEventId,
    city,
    country,
    datetime,
    idpLabel,
    interactionAcr,
  }: TrackCardConnectionProps) => {
    const {
      luxon: { datetimeShortFrFormat },
    } = ConfigService.get<TracksConfig>(TracksOptions.CONFIG_NAME);

    const formattedTime = datetime
      .setZone('Europe/Paris')
      .setLocale('fr')
      .toFormat(datetimeShortFrFormat);

    return (
      <ul className="fr-text--md fr-p-0 fr-mb-0 unstyled-list">
        <li>
          <span>Une connexion à ce service a eu lieu le&nbsp;:&nbsp;</span>
          <strong data-testid="ConnectionComponent-connection-datetime-label">
            {formattedTime} (heure de Paris)
          </strong>
        </li>
        {(city || country) && (
          <li>
            <span>Localisation&nbsp;:&nbsp;</span>
            <strong data-testid="ConnectionComponent-location-label">
              {city} {country && `(${country})`}
            </strong>
          </li>
        )}
        <li>
          <span>Via le compte&nbsp;:&nbsp;</span>
          <strong data-testid="ConnectionComponent-idp-label">{idpLabel}</strong>
        </li>
        <li>
          <span>Niveau de garantie eIDAS&nbsp;:&nbsp;</span>
          <strong data-testid="ConnectionComponent-eidas-label">
            {EidasToLabel[interactionAcr]}
          </strong>
        </li>
        <li>
          <span>Code d’identification&nbsp;:&nbsp;</span>
          <strong data-testid="ConnectionComponent-authentication-event-id">
            {authenticationEventId}
          </strong>
        </li>
      </ul>
    );
  },
);

ConnectionComponent.displayName = 'TrackCardConnectionComponent';

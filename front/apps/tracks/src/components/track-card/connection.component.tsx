import { DateTime } from 'luxon';
import React from 'react';

import { EidasToLabel } from '../../enums';
import { TracksConfig } from '../../interfaces';

type TrackCardConnectionProps = {
  city: string | undefined;
  country: string | undefined;
  datetime: DateTime;
  idpLabel: string;
  spAcr: keyof typeof EidasToLabel;
  options: TracksConfig;
};

export const ConnectionComponent = React.memo(
  ({ city, country, datetime, idpLabel, options, spAcr }: TrackCardConnectionProps) => {
    const formattedTime = datetime
      .setZone('Europe/Paris')
      .setLocale('fr')
      .toFormat(options.LUXON_FORMAT_DATETIME_SHORT_FR);

    return (
      <React.Fragment>
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
            <strong data-testid="ConnectionComponent-eidas-label">{EidasToLabel[spAcr]}</strong>
          </li>
        </ul>
      </React.Fragment>
    );
  },
);

ConnectionComponent.displayName = 'TrackCardConnectionComponent';

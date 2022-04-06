import classnames from 'classnames';
import { DateTime } from 'luxon';
import React from 'react';

import { EidasToLabel } from '../../enums';

type TraceCardContentProps = {
  accessibleId: string;

  datetime: DateTime;
  opened: boolean;
  spAcr: keyof typeof EidasToLabel;
  /**
   * @todo #820
   *
   * Use to set up time format
   *
   * Author: Arnaud PSA
   * Date: 10/02/2022
   */
  // options: TracksConfig;
  city: string;
  country: string;
  claims: string[] | null;
  idpName: string;
};

export const TrackCardContentComponent = React.memo(
  ({
    accessibleId,
    city,
    claims,
    country,
    datetime,
    idpName,
    opened,
    spAcr,
  }: TraceCardContentProps) => {
    const formattedTime = datetime.setLocale('fr-FR').toLocaleString(DateTime.DATETIME_MED);

    return (
      <dl
        aria-hidden={!opened}
        className={classnames('details', 'fr-text', {
          mt16: opened,
          'no-display': !opened,
        })}
        id={accessibleId}
        role="region"
        tabIndex={-1}>
        <dt className="mb12">
          <span>Le service a récupéré les données suivantes</span>
        </dt>
        <dd className="ml32">
          <ul>
            <li>
              <span>Connexion à ce service a eu lieu le &nbsp;:&nbsp;</span>
              <br />
              <b>{formattedTime} (heure de Paris)</b>
            </li>
            <li>
              <span>Localisation &nbsp;:&nbsp;</span>
              <b>
                {city} ({country})
              </b>
            </li>
            <li>
              <span>Via le compte&nbsp;:&nbsp;</span>
              <br />
              <b>{idpName}</b>
            </li>

            <li>
              <span>Niveau de garantie eIDAS&nbsp;:&nbsp;</span>
              <a
                className="is-g700"
                href="/"
                title={`En savoir plus sur le niveau de sécurité ${EidasToLabel[spAcr]}`}>
                <b>{EidasToLabel[spAcr]}</b>
              </a>
            </li>

            {claims && (
              /**
               * @todo #820 display the good way the claims group
               *
               * Author: Arnaud PSA
               * Date: 18/02/2022
               */
              <li>
                <span>Récupération des données&nbsp;:&nbsp;</span>
                <br />
                <b>{claims.join(', ')}</b>
              </li>
            )}
          </ul>
        </dd>
      </dl>
    );
  },
);

TrackCardContentComponent.displayName = 'TrackCardContentComponent';

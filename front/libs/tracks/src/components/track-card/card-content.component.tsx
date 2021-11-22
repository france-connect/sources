import classnames from 'classnames';
import { DateTime } from 'luxon';
import React from 'react';
import { TracksConfig } from '../../interfaces';

type TraceCardContentProps = {
  accessibleId: string;
  accountId: string;
  datetime: DateTime;
  opened: boolean;
  spAcr: string;
  options: TracksConfig;
};

const TraceCardContentComponent = React.memo(
  ({
    accessibleId,
    accountId,
    datetime,
    opened,
    spAcr,
    options,
  }: TraceCardContentProps) => {
    const formattedTime = datetime.toFormat(options.LUXON_FORMAT_HOUR_MINS);
    const formattedLocation = datetime.toFormat(options.LUXON_FORMAT_TIMEZONE);

    return (
      <dl
        aria-hidden={!opened}
        className={classnames('details', 'fr-text', {
          mt16: opened,
          'no-display': !opened,
        })}
        id={accessibleId}
        role="region"
        tabIndex={-1}
      >
        <dt className="mb12">
          <span>Le service a récupéré les données suivantes</span>
        </dt>
        <dd className="ml32">
          <ul>
            <li>
              <span>Heure&nbsp;:&nbsp;</span>
              <b>{formattedTime} (heure de Paris)</b>
            </li>
            <li>
              <span>Localisation&nbsp;:&nbsp;</span>
              <b>{formattedLocation}</b>
            </li>
            <li>
              <span>Compte Utilisé&nbsp;:&nbsp;</span>
              <b>{accountId}</b>
            </li>
            <li>
              <span>Niveau de sécurité&nbsp;:&nbsp;</span>
              <a
                className="is-g700"
                href="/"
                title={`En savoir plus sur le niveau de sécurité ${spAcr}`}
              >
                <b>{spAcr}</b>
              </a>
            </li>
          </ul>
        </dd>
      </dl>
    );
  },
);

TraceCardContentComponent.displayName = 'TraceCardContentComponent';

export default TraceCardContentComponent;

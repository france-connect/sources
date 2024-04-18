import classnames from 'classnames';
import type { DateTime } from 'luxon';
import React from 'react';
import { AiOutlineMinus as MinusIcon, AiOutlinePlus as PlusIcon } from 'react-icons/ai';

import type { TracksConfig } from '../../interfaces';
import styles from './card-header.module.scss';

type TraceCardHeaderProps = {
  datetime: DateTime;
  serviceProviderLabel: string;
  opened: boolean;
  options: TracksConfig;
};

export const TrackCardHeaderComponent = React.memo(
  ({ datetime, opened, options, serviceProviderLabel }: TraceCardHeaderProps) => {
    const formattedDay = datetime
      .setZone('Europe/Paris')
      .setLocale('fr')
      .toFormat(options.LUXON_FORMAT_DAY);
    return (
      <div className="fr-pt-3v flex-columns flex-between items-center">
        <div>
          <p className="fr-mb-1v" data-testid="TrackCardHeaderComponent-connection-date-label">
            {formattedDay}
          </p>
          <h3
            className={classnames(styles.title, 'fr-text--lg fr-mb-0')}
            data-testid="TrackCardHeaderComponent-sp-label">
            {serviceProviderLabel}
          </h3>
        </div>
        <div>
          {opened && <MinusIcon className={styles.icon} size={30} title="Icone moins" />}
          {!opened && <PlusIcon className={styles.icon} size={30} title="Icone plus" />}
        </div>
      </div>
    );
  },
);

TrackCardHeaderComponent.displayName = 'TraceCardHeaderComponent';

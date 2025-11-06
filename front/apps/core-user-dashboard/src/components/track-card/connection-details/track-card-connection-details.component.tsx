import { DateTime } from 'luxon';
import React from 'react';

import { ConfigService } from '@fc/config';
import { t } from '@fc/i18n';
import type { TracksConfig } from '@fc/tracks';
import { TracksOptions } from '@fc/tracks';

import type { TrackInterface } from '../../../interfaces';

type TrackCardConnexionDetailsProps = {
  track: TrackInterface;
};

export const TrackCardConnexionDetailsComponent = React.memo(
  ({ track }: TrackCardConnexionDetailsProps) => {
    const { idpLabel, time } = track;

    const {
      luxon: { datetimeShortFrFormat },
    } = ConfigService.get<TracksConfig>(TracksOptions.CONFIG_NAME);

    const datetime = DateTime.fromMillis(time);
    const formattedTime = datetime
      .setZone('Europe/Paris')
      .setLocale('fr')
      .toFormat(datetimeShortFrFormat);

    return (
      <ul className="fr-text--md fr-p-0 fr-mb-0 unstyled-list">
        <li>
          <span>{t('CoreUserDashboard.trackCard.connectedAt')}</span>
          <span data-testid="TrackCardConnexionDetailsComponent-connection-datetime-label">
            {t('CoreUserDashboard.trackCard.CEST', { time: formattedTime })}
          </span>
        </li>
        <li>
          <span>{t('CoreUserDashboard.trackCard.connectedVia')}</span>
          <strong data-testid="TrackCardConnexionDetailsComponent-idp-label">{idpLabel}</strong>
        </li>
      </ul>
    );
  },
);

TrackCardConnexionDetailsComponent.displayName = 'TrackCardTrackCardConnexionDetailsComponent';

import React from 'react';

import { t } from '@fc/i18n';

import { TrackCardComponent } from '../../../components/track-card';
import type { TrackInterface } from '../../../interfaces';

interface IdentityTheftReportTracksComponentProps {
  code: string;
  tracks: TrackInterface[];
}

export const IdentityTheftReportTracksComponent = React.memo(
  ({ code, tracks }: IdentityTheftReportTracksComponentProps) => (
    <React.Fragment>
      <h3>{t('IdentityTheftReport.tracks.title')}</h3>
      <p className="fr-text--lead">
        <b>{code}</b>
      </p>
      <div>
        {tracks.map((track) => (
          <TrackCardComponent key={track.trackId} track={track} />
        ))}
      </div>
    </React.Fragment>
  ),
);

IdentityTheftReportTracksComponent.displayName = 'IdentityTheftReportTracksComponent';

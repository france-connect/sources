import classnames from 'classnames';
import type { DateTime } from 'luxon';
import React from 'react';

import type { EidasToLabel } from '../../enums';
import { CinematicEvents } from '../../enums';
import type { IRichClaim, TracksConfig } from '../../interfaces';
import { ClaimsComponent } from './claims.component';
import { ConnectionComponent } from './connection.component';

type TraceCardContentProps = {
  accessibleId: string;
  eventType: CinematicEvents;
  datetime: DateTime;
  opened: boolean;
  spAcr: keyof typeof EidasToLabel;
  city: string | undefined;
  country: string | undefined;
  claims: IRichClaim[];
  idpLabel: string;
  options: TracksConfig;
};

export const TrackCardContentComponent = React.memo(
  ({
    accessibleId,
    city,
    claims,
    country,
    datetime,
    eventType,
    idpLabel,
    opened,
    options,
    spAcr,
  }: TraceCardContentProps) => {
    const shouldDisplayClaims =
      claims &&
      claims.length > 0 &&
      [
        CinematicEvents.DP_VERIFIED_FC_CHECKTOKEN,
        CinematicEvents.FC_DATATRANSFER_CONSENT_IDENTITY,
      ].includes(eventType);

    const shouldDisplayConnexion = eventType === CinematicEvents.FC_VERIFIED;

    return (
      <div
        aria-hidden={!opened}
        className={classnames({
          // class CSS
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'fr-mb-1w': opened,
          // class CSS
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'fr-mt-2w': opened,
          // class CSS
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'no-display': !opened,
        })}
        id={accessibleId}
        role="region"
        tabIndex={-1}>
        {shouldDisplayConnexion && (
          <ConnectionComponent
            city={city}
            country={country}
            datetime={datetime}
            idpLabel={idpLabel}
            options={options}
            spAcr={spAcr}
          />
        )}

        {shouldDisplayClaims && (
          <ClaimsComponent
            claims={claims}
            datetime={datetime}
            eventType={eventType}
            options={options}
          />
        )}
      </div>
    );
  },
);

TrackCardContentComponent.displayName = 'TrackCardContentComponent';

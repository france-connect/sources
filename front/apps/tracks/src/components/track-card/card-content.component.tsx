import classnames from 'classnames';
import type { DateTime } from 'luxon';
import React from 'react';

import type { EidasToLabel } from '../../enums';
import { CinematicEvents } from '../../enums';
import type { RichClaimInterface } from '../../interfaces';
import { ClaimsComponent } from './claims.component';
import { ConnectionComponent } from './connection.component';

type TraceCardContentProps = {
  accessibleId: string;
  eventType: CinematicEvents;
  datetime: DateTime;
  opened: boolean;
  interactionAcr: keyof typeof EidasToLabel;
  city: string | undefined;
  country: string | undefined;
  claims: RichClaimInterface[];
  idpLabel: string;
  authenticationEventId: string;
};

export const TrackCardContentComponent = React.memo(
  ({
    accessibleId,
    authenticationEventId,
    city,
    claims,
    country,
    datetime,
    eventType,
    idpLabel,
    interactionAcr,
    opened,
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
            authenticationEventId={authenticationEventId}
            city={city}
            country={country}
            datetime={datetime}
            idpLabel={idpLabel}
            interactionAcr={interactionAcr}
          />
        )}

        {shouldDisplayClaims && (
          <ClaimsComponent claims={claims} datetime={datetime} eventType={eventType} />
        )}
      </div>
    );
  },
);

TrackCardContentComponent.displayName = 'TrackCardContentComponent';

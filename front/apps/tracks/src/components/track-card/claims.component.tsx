import { DateTime } from 'luxon';
import React from 'react';

import { CinematicEvents } from '../../enums';
import { IGroupedClaims, IRichClaim, TracksConfig } from '../../interfaces';
import { groupByDataProvider } from '../../utils';

type ClaimsComponentProps = {
  claims: IRichClaim[];
  datetime: DateTime;
  eventType: string;
  options: TracksConfig;
};

const IDENTITY_DP = ['FCP_HIGH', 'FCP_LOW'];

const excludeIdentityProviders = ([dataProvider]: [string, {}]) =>
  !IDENTITY_DP.includes(dataProvider);

export const ClaimsComponent = React.memo(
  ({ claims, datetime, eventType, options }: ClaimsComponentProps) => {
    const formattedTime = datetime
      .setZone('Europe/Paris')
      .setLocale('fr')
      .toFormat(options.LUXON_FORMAT_DATETIME_SHORT_FR);

    const filteredClaims = claims.filter(
      ({ identifier }) => identifier !== 'sub' && !identifier.startsWith('rnipp_'),
    );

    const groupedClaims: IGroupedClaims = groupByDataProvider(filteredClaims);

    let globalBaseLine =
      'Vous avez autorisé la transmission de données personnelles à ce service le :';

    if (eventType === CinematicEvents.DP_REQUESTED_FC_CHECKTOKEN) {
      globalBaseLine = 'Des données ont été transmises à ce service le :';
    }

    let dataProviderBaseLine =
      'Vous avez autorisé le service à récupérer les données suivantes depuis';

    if (eventType === CinematicEvents.DP_REQUESTED_FC_CHECKTOKEN) {
      dataProviderBaseLine = 'Le service a récupéré les données suivantes depuis';
    }

    let entries = Object.entries(groupedClaims);

    if (eventType === CinematicEvents.DP_REQUESTED_FC_CHECKTOKEN) {
      entries = entries.filter(excludeIdentityProviders);
    }

    return (
      <React.Fragment>
        <p>
          <strong>{globalBaseLine}</strong>
          <br />
          <span data-testid="ClaimsComponent-date-label">{formattedTime} (heure de Paris)</span>
        </p>
        {entries.map(([dataProvider, { claims: claimLabels, label }]) => (
          <div key={dataProvider} data-testid={`ClaimsComponent-claims-${dataProvider}`}>
            <h4
              className="fr-text--md fr-mb-0"
              data-testid={`ClaimsComponent-claims-title-${dataProvider}`}>
              {dataProviderBaseLine} {label}&nbsp;:
            </h4>

            <ul data-testid={`ClaimsComponent-claims-list-${dataProvider}`}>
              {claimLabels.map((claim) => (
                <li key={claim}>{claim}</li>
              ))}
            </ul>
          </div>
        ))}
      </React.Fragment>
    );
  },
);

ClaimsComponent.displayName = 'ClaimsComponent';

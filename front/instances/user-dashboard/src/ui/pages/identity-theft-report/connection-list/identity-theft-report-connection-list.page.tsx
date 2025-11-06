import React from 'react';
import { useLoaderData } from 'react-router';

import {
  IdentityTheftReportConnectionListActionsComponent,
  IdentityTheftReportHelpEventIdAccordionComponent,
  IdentityTheftReportTracksComponent,
} from '@fc/core-user-dashboard';

import type { FraudTracksLoaderResponseInterface } from '../../../../interfaces';

export const IdentityTheftReportConnectionListPage = React.memo(() => {
  const { data } = useLoaderData<FraudTracksLoaderResponseInterface>();
  const {
    meta: { code },
    payload: tracks,
  } = data;

  return (
    <React.Fragment>
      <h2>Identification de la connexion</h2>
      <div
        className="fr-mt-3w fr-p-3w fr-border-default--grey"
        data-testid="IdentityTheftReportConnectionListPage-container">
        <IdentityTheftReportTracksComponent code={code} tracks={tracks} />
        <IdentityTheftReportConnectionListActionsComponent />
      </div>
      <IdentityTheftReportHelpEventIdAccordionComponent />
    </React.Fragment>
  );
});

IdentityTheftReportConnectionListPage.displayName = 'IdentityTheftReportConnectionListPage';

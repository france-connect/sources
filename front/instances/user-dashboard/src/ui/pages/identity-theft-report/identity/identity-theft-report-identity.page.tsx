import React from 'react';

import { IdentityTheftReportFormComponent } from '@fc/core-user-dashboard';

export const IdentityTheftReportIdentityPage = React.memo(() => (
  <React.Fragment>
    <h2>Identité de la personne usurpée</h2>
    <IdentityTheftReportFormComponent id="IdentityTheftIdentity" />
  </React.Fragment>
));

IdentityTheftReportIdentityPage.displayName = 'IdentityTheftReportIdentityPage';

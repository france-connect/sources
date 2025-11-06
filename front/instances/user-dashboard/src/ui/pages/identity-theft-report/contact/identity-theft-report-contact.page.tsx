import React from 'react';

import { IdentityTheftReportFormComponent } from '@fc/core-user-dashboard';

export const IdentityTheftReportContactPage = React.memo(() => (
  <React.Fragment>
    <h2>Moyens de contact</h2>
    <IdentityTheftReportFormComponent id="IdentityTheftContact" />
  </React.Fragment>
));

IdentityTheftReportContactPage.displayName = 'IdentityTheftReportContactPage';

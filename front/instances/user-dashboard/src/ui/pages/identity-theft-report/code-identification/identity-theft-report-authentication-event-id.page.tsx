import React from 'react';

import { HeadingTag, MessageTypes } from '@fc/common';
import {
  IdentityTheftReportFormComponent,
  IdentityTheftReportHelpEventIdAccordionComponent,
} from '@fc/core-user-dashboard';
import { AlertComponent } from '@fc/dsfr';
import { t } from '@fc/i18n';

export const IdentityTheftReportAuthenticationEventIdPage = React.memo(() => (
  <React.Fragment>
    <h2>{t('IdentityTheftReport.codeIdentificationPage.title')}</h2>
    <AlertComponent
      heading={HeadingTag.H6}
      title={t('IdentityTheftReport.codeIdentificationPage.alertTitle')}
      type={MessageTypes.INFO}>
      <p>{t('IdentityTheftReport.codeIdentificationPage.alertContent')}</p>
    </AlertComponent>
    <IdentityTheftReportFormComponent id="IdentityTheftConnection" />
    <IdentityTheftReportHelpEventIdAccordionComponent />
  </React.Fragment>
));

IdentityTheftReportAuthenticationEventIdPage.displayName =
  'IdentityTheftReportAuthenticationEventIdPage';

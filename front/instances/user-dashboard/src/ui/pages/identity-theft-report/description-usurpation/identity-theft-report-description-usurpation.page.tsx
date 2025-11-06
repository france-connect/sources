import React from 'react';

import { MessageTypes } from '@fc/common';
import { IdentityTheftReportFormComponent } from '@fc/core-user-dashboard';
import { AlertComponent } from '@fc/dsfr';

export const IdentityTheftReportDescriptionUsurpationPage = React.memo(() => (
  <React.Fragment>
    <h2>Description de l’usurpation</h2>
    <AlertComponent
      title="Munissez vous de l’alerte de connexion que vous avez reçue par email."
      type={MessageTypes.INFO}>
      <p>Vous trouverez dans l’email les informations nécessaires à nous transmettre.</p>
    </AlertComponent>
    <IdentityTheftReportFormComponent id="IdentityTheftDescription" />
  </React.Fragment>
));

IdentityTheftReportDescriptionUsurpationPage.displayName =
  'IdentityTheftReportDescriptionUsurpationPage';

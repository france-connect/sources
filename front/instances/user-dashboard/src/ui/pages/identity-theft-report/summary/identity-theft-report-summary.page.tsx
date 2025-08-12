import React from 'react';

import { TableComponent } from '@fc/dsfr';
import { DTO2FormComponent } from '@fc/dto2form';
import { t } from '@fc/i18n';

import { useSummaryPage } from './summary-page.hook';

export const IdentityTheftReportSummaryPage = React.memo(() => {
  const { config, onPostSubmit, onPreSubmit, onSubmit, schema, values } = useSummaryPage();

  return (
    <React.Fragment>
      <h2>Récapitulatif des informations saisies</h2>
      <div className="fr-border-default--grey fr-mt-3w fr-p-3w">
        <TableComponent
          hideHeader
          caption="Décrivez votre cas d’usurpation en quelques mots"
          id="identity-theft-report-summary--description"
          sources={[{ label: values.description.description }]}
        />

        <TableComponent
          hideHeader
          caption="Code d’identification de la connexion frauduleuse"
          id="identity-theft-report-summary--code-identification"
          sources={[{ label: values.connection.code }]}
        />

        <TableComponent
          hideHeader
          caption="Etat civil"
          id="identity-theft-report-summary--etat-civil"
          sources={[
            { label: 'Nom de naissance', value: values.identity.family_name },
            { label: 'Prénom de naissance', value: values.identity.given_name },
            { label: 'Date de naissance', value: values.identity.rawBirthdate },
            { label: 'Pays de naissance', value: values.identity.rawBirthcountry },
            { label: 'Ville de naissance', value: values.identity.rawBirthplace },
          ]}
        />

        <TableComponent
          hideHeader
          caption="Adresse électronique"
          id="identity-theft-report-summary--email"
          sources={[{ label: values.contact.email }]}
        />

        <TableComponent
          hideHeader
          caption="Numéro de téléphone"
          id="identity-theft-report-summary--phone"
          sources={[{ label: values.contact.phone }]}
        />

        <DTO2FormComponent
          // @TODO the "no required" parameter has no effect here
          // it is supposed to remove the required fields mentions
          // a discussion is needed to decide if we keep this option
          // in the DTO2FormComponent
          noRequired
          config={config}
          initialValues={{}}
          schema={schema}
          submitLabel={t('Fraud.IdentityTheftReport.sendReportButton')}
          onPostSubmit={onPostSubmit}
          onPreSubmit={onPreSubmit}
          onSubmit={onSubmit}
        />
      </div>
    </React.Fragment>
  );
});

IdentityTheftReportSummaryPage.displayName = 'IdentityTheftReportSummaryPage';

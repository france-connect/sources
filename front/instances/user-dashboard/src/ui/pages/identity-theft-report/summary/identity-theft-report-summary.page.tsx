import React from 'react';

import type { TrackInterface } from '@fc/core-user-dashboard';
import { TrackCardComponent } from '@fc/core-user-dashboard';
import { TableComponent } from '@fc/dsfr';
import { Dto2FormComponent } from '@fc/dto2form';
import { t } from '@fc/i18n';

import { useSummaryPage } from '../../../../hooks';

export const IdentityTheftReportSummaryPage = React.memo(() => {
  const { config, onPostSubmit, onPreSubmit, onSubmit, schema, summary } = useSummaryPage();

  const { connection, contact, description, fraudTracks, identity } = summary;

  const phonevalue = summary.contact.phone ? summary.contact.phone : t('FC.Common.notAvailable');

  const hasTracks = fraudTracks && fraudTracks.length > 0;

  return (
    <React.Fragment>
      <h2>Récapitulatif des informations saisies</h2>
      <div className="fr-border-default--grey fr-mt-3w fr-p-3w">
        <TableComponent
          hideHeader
          multiline
          caption="Décrivez votre cas d’usurpation en quelques mots"
          id="identity-theft-report-summary--description"
          sources={[{ label: description.description }]}
        />

        <TableComponent
          hideHeader
          caption="Code d’identification de la connexion frauduleuse"
          id="identity-theft-report-summary--code-identification"
          sources={[{ label: connection.code }]}
        />

        {hasTracks && (
          <React.Fragment>
            <h4>{t('IdentityTheftReport.summaryPage.tracksTitle')}</h4>
            <div className="fr-mb-5w">
              {fraudTracks.map((track: TrackInterface) => (
                <TrackCardComponent key={track.trackId} track={track} />
              ))}
            </div>
          </React.Fragment>
        )}

        <TableComponent
          hideHeader
          caption="Etat civil"
          id="identity-theft-report-summary--etat-civil"
          sources={[
            { label: 'Nom de naissance', value: identity.family_name },
            { label: 'Prénom de naissance', value: identity.given_name },
            { label: 'Date de naissance', value: identity.rawBirthdate },
            { label: 'Pays de naissance', value: identity.rawBirthcountry },
            { label: 'Ville de naissance', value: identity.rawBirthplace },
          ]}
        />

        <TableComponent
          hideHeader
          caption="Adresse électronique"
          id="identity-theft-report-summary--email"
          sources={[{ label: contact.email }]}
        />

        <TableComponent
          hideHeader
          caption="Numéro de téléphone"
          id="identity-theft-report-summary--phone"
          sources={[{ label: phonevalue }]}
        />

        <Dto2FormComponent
          config={config}
          initialValues={{}}
          schema={schema}
          onPostSubmit={onPostSubmit}
          onPreSubmit={onPreSubmit}
          onSubmit={onSubmit}
        />
      </div>
    </React.Fragment>
  );
});

IdentityTheftReportSummaryPage.displayName = 'IdentityTheftReportSummaryPage';

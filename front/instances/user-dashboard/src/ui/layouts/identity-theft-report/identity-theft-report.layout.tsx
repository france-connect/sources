import React from 'react';
import { Outlet } from 'react-router';
import { useDocumentTitle } from 'usehooks-ts';

export const IdentityTheftReportLayout = React.memo(() => {
  useDocumentTitle('Mon tableau de bord - Signaler une usurpation');

  return (
    <div className="fr-container fr-mt-5w fr-mt-md-8w">
      <div className="fr-grid-row fr-grid-row--center">
        <div className="fr-col-12 fr-col-md-10 fr-col-lg-8">
          <h1 className="text-left text-center--md">
            Formulaire de signalement
            <br />
            Usurpation d’identité
          </h1>
          <Outlet />
        </div>
      </div>
    </div>
  );
});

IdentityTheftReportLayout.displayName = 'IdentityTheftReportLayout';

import React from 'react';
import { Outlet, useMatch } from 'react-router';

import { MessageTypes } from '@fc/common';
import { NoticeComponent } from '@fc/dsfr';
import { t } from '@fc/i18n';

export const PageLayout = React.memo(() => {
  // @TODO to be removed with next BDD update
  // https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/2625
  const isServiceProviderPage = useMatch({ path: '/fournisseurs-de-service' });

  return (
    <React.Fragment>
      {isServiceProviderPage ? (
        // @TODO to be removed with next BDD update
        // https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/2625
        <NoticeComponent
          description={t('Partners.layout.serviceProvidersNoticeDescription')}
          title={t('Partners.layout.serviceProvidersNoticeTitle')}
          type={MessageTypes.WARNING}
        />
      ) : (
        <NoticeComponent
          description={t('Partners.layout.noticeDescription')}
          title={t('Partners.layout.noticeTitle')}
        />
      )}
      <main className="fr-container fr-py-8v">
        <div className="fr-grid-row fr-grid-row--center">
          <Outlet />
        </div>
      </main>
    </React.Fragment>
  );
});

PageLayout.displayName = 'PageLayout';

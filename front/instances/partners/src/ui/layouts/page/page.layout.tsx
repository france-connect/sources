import React from 'react';
import { Outlet } from 'react-router';

import { NoticeComponent } from '@fc/dsfr';
import { t } from '@fc/i18n';

export const PageLayout = React.memo(() => (
  <React.Fragment>
    <NoticeComponent
      description={t('Partners.layout.noticeDescription')}
      title={t('Partners.layout.noticeTitle')}
    />
    <main className="fr-container fr-py-8v">
      <div className="fr-grid-row fr-grid-row--center">
        <Outlet />
      </div>
    </main>
  </React.Fragment>
));

PageLayout.displayName = 'PageLayout';

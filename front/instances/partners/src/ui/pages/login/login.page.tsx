import classnames from 'classnames';
import React from 'react';

import { ConnectTypes, NoticeComponent } from '@fc/dsfr';
import { t } from '@fc/i18n';
import { LoginFormComponent } from '@fc/login-form';
import { useStylesQuery, useStylesVariables } from '@fc/styles';

export const LoginPage = () => {
  const [breakpointLg] = useStylesVariables(['breakpoint-lg']);

  const gtDesktop = useStylesQuery({ minWidth: breakpointLg });

  const noticeTitle = t('Partners.page.noticeTitle');
  const noticeDescription = t('Partners.page.noticeDescription');

  return (
    <React.Fragment>
      <NoticeComponent description={noticeDescription} title={noticeTitle} />
      <main className="fr-container fr-py-8v">
        <div
          className={classnames('fr-grid-row fr-grid-row--center', {
            // Class CSS
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'fr-mt-5w': !gtDesktop,
            // Class CSS
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'fr-mt-8w': gtDesktop,
          })}>
          <div className="fr-col-9">
            <h1>{t('Partners.loginpage.title')}</h1>
            <h2 className="fr-mt-4w">{t('Partners.loginpage.description')}</h2>
            <LoginFormComponent
              showHelp
              className="flex-rows items-start"
              connectType={ConnectTypes.PRO_CONNECT}
            />
          </div>
        </div>
      </main>
    </React.Fragment>
  );
};

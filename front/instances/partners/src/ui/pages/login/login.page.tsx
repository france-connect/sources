import classnames from 'classnames';
import React from 'react';

import { useAccountContext } from '@fc/account';
import { MessageTypes } from '@fc/common';
import { AlertComponent, ConnectTypes, NoticeComponent, Sizes } from '@fc/dsfr';
import { t } from '@fc/i18n';
import { LoginFormComponent } from '@fc/login-form';
import { useStylesQuery, useStylesVariables } from '@fc/styles';

export const LoginPage = React.memo(() => {
  // @NOTE create a custom hook to handle the logic
  // keep homogeneous code with other pages
  const { expired } = useAccountContext();

  // @NOTE useless hook
  // instead use DSFR CSS Breakpoints classes
  // @SEE https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/2396
  const [breakpointLg] = useStylesVariables(['breakpoint-lg']);

  const gtDesktop = useStylesQuery({ minWidth: breakpointLg });

  return (
    <React.Fragment>
      <NoticeComponent
        description={t('Partners.layout.noticeDescription')}
        title={t('Partners.layout.noticeTitle')}
      />
      <main className="fr-container fr-py-8v">
        {expired && (
          <AlertComponent
            className="text-left fr-my-3w"
            size={Sizes.MEDIUM}
            title={t('FC.session.expired')}
            type={MessageTypes.ERROR}
          />
        )}
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
});

LoginPage.displayName = 'LoginPage';

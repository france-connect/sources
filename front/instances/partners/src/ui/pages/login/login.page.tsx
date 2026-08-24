import React from 'react';

import { useAccountContext } from '@fc/account';
import { MessageTypes } from '@fc/common';
import { AlertComponent, ConnectTypes, Sizes } from '@fc/dsfr';
import { t } from '@fc/i18n';
import { LoginFormComponent } from '@fc/login-form';

export const LoginPage = React.memo(() => {
  // @NOTE create a custom hook to handle the logic
  // keep homogeneous code with other pages
  const { expired } = useAccountContext();

  return (
    <main className="fr-container fr-py-8v">
      {expired && (
        <div className="fr-grid-row fr-grid-row--left fr-my-3w">
          <div className="fr-col-12">
            <AlertComponent
              size={Sizes.MEDIUM}
              title={t('FC.session.expired')}
              type={MessageTypes.ERROR}
            />
          </div>
        </div>
      )}
      <div className="fr-grid-row fr-grid-row--center fr-mt-5w fr-mt-md-8w">
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
  );
});

LoginPage.displayName = 'LoginPage';

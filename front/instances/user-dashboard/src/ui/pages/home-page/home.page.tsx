import classnames from 'classnames';
import React from 'react';
import { useLocation } from 'react-router';

import { ConnectTypes, Sizes } from '@fc/dsfr';
import { t } from '@fc/i18n';
import { LoginFormComponent } from '@fc/login-form';

import { LoginLayout } from '../../layouts';
import styles from './home.module.scss';

export const HomePage = React.memo(() => {
  const location = useLocation();

  const { pathname } = location.state?.from ?? {};

  return (
    <LoginLayout documentTitle={t('UserDashboard.homepage.documentTitle')} size={Sizes.MEDIUM}>
      <h1 className="fr-text-title--blue-france fr-mb-5w">{t('UserDashboard.homepage.title')}</h1>
      <LoginFormComponent
        className="flex-rows items-center"
        connectType={ConnectTypes.FRANCE_CONNECT}
        redirectUrl={pathname}
      />
      <p className={classnames(styles.paragraph, 'fr-m-auto fr-mt-7v')} data-testid="paragraph">
        {t('UserDashboard.homepage.paragraph')}
      </p>
    </LoginLayout>
  );
});

HomePage.displayName = 'HomePage';

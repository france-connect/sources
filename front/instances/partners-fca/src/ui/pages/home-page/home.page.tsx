import React from 'react';
import { Link } from 'react-router-dom';

import { t } from '@fc/i18n';

export const HomePage = React.memo(() => (
  <div className="content-wrapper-lg text-center fr-mt-8w" id="page-container">
    <h1 className="is-blue-france">{t('HomePage.welcome')}</h1>
    <p>{t('HomePage.baseline')}</p>
    <Link className="fr-link" data-testid="login-button" to="/login">
      {t('HomePage.loginButton')}
    </Link>
  </div>
));

HomePage.displayName = 'HomePage';

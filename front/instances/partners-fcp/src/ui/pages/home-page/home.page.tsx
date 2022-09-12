import React from 'react';
import { Link } from 'react-router-dom';

import { t } from '@fc/i18n';

export const HomePage = React.memo(() => (
  <div className="fr-container text-center fr-mt-8w">
    <h1 className="is-blue-france">{t('HomePage.welcome')}</h1>
    <p>{t('HomePage.baseline')}</p>
    <Link className="fr-link" data-testid="login-button" to="/login">
      {t('HomePage.loginButton')}
    </Link>
  </div>
));

HomePage.displayName = 'HomePage';

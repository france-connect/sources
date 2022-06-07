import classnames from 'classnames';
import React from 'react';
import { useMediaQuery } from 'react-responsive';

import { useApiGet } from '@fc/common';
import { ButtonTypes, FranceConnectButton } from '@fc/dsfr';
import { RedirectToIdpFormComponent } from '@fc/oidc-client';

import styles from './home.module.scss';

export const HomePage = React.memo(() => {
  const csrf = useApiGet<{ csrfToken: string }>({ endpoint: '/api/csrf-token' });
  const gtTablet = useMediaQuery({ query: '(min-width: 992px)' });
  const gtMobile = useMediaQuery({ query: '(min-width: 576px)' });

  return (
    <div
      className={classnames('homepage fr-m-auto fr-px-2w', {
        // Class CSS
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'fr-mt-5w': !gtTablet,
        // Class CSS
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'fr-mt-8w': gtTablet,
        // Class CSS
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'text-center': gtMobile,
        // Class CSS
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'text-left': !gtMobile,
      })}
      id="page-container">
      <h1 className={classnames(styles.title, 'fr-mb-5w')}>
        Pour accéder à votre historique d’utilisation de FranceConnect, veuillez vous connecter
      </h1>
      {csrf && (
        <RedirectToIdpFormComponent csrf={csrf.csrfToken} id="login-form">
          <FranceConnectButton buttonType={ButtonTypes.SUBMIT} className="flex-rows items-center" />
        </RedirectToIdpFormComponent>
      )}
      <p className={classnames(styles.paragraph, 'fr-m-auto fr-mt-7v')} data-testid="paragraph">
        Une fois connecté, vous pourrez accéder à l’ensemble des connexions et échanges de données
        liés à votre compte sur les 6 derniers mois.
      </p>
    </div>
  );
});

HomePage.displayName = 'HomePage';

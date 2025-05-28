import classnames from 'classnames';
import React from 'react';
import { useLocation } from 'react-router';

import type { AccountContextState } from '@fc/account';
import { AccountContext } from '@fc/account';
import { EventTypes, useSafeContext } from '@fc/common';
import { AlertComponent, ConnectTypes, Sizes } from '@fc/dsfr';
import { LoginFormComponent } from '@fc/login-form';
import { useStylesQuery, useStylesVariables } from '@fc/styles';

import styles from './home.module.scss';

export const HomePage = React.memo(() => {
  const { expired } = useSafeContext<AccountContextState>(AccountContext);
  const location = useLocation();

  const [breakpointLg, breakpointSm] = useStylesVariables(['breakpoint-lg', 'breakpoint-sm']);

  const gtDesktop = useStylesQuery({ minWidth: breakpointLg });
  const gtMobile = useStylesQuery({ minWidth: breakpointSm });

  const { pathname } = location.state?.from ?? {};

  return (
    <div
      className={classnames('large-container fr-m-auto fr-px-2w', {
        // Class CSS
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'fr-mt-5w': !gtDesktop,
        // Class CSS
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'fr-mt-8w': gtDesktop,
        // Class CSS
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'text-center': gtMobile,
        // Class CSS
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'text-left': !gtMobile,
      })}
      id="page-container">
      {expired && (
        <AlertComponent className="text-left fr-my-3w" size={Sizes.SMALL} type={EventTypes.WARNING}>
          <p>Votre session a expiré, veuillez vous reconnecter</p>
        </AlertComponent>
      )}
      <h1 className={classnames(styles.title, 'fr-mb-5w')}>
        Pour accéder à votre tableau de bord FranceConnect, veuillez vous connecter
      </h1>
      <LoginFormComponent
        className="flex-rows items-center"
        connectType={ConnectTypes.FRANCE_CONNECT}
        redirectUrl={pathname}
      />
      <p className={classnames(styles.paragraph, 'fr-m-auto fr-mt-7v')} data-testid="paragraph">
        Une fois connecté, vous pourrez consulter l’historique de vos connexions et configurer vos
        accès FranceConnect.
      </p>
    </div>
  );
});

HomePage.displayName = 'HomePage';

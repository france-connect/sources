import classnames from 'classnames';
import React from 'react';
import { useLocation } from 'react-router-dom';

import type { AccountContextState } from '@fc/account';
import { AccountContext } from '@fc/account';
import { EventTypes, useSafeContext } from '@fc/common';
import { AlertComponent, ConnectTypes, LinkComponent, Sizes } from '@fc/dsfr';
import { LoginFormComponent } from '@fc/login-form';
import { useStylesQuery, useStylesVariables } from '@fc/styles';
import { getFraudSupportFormUrl, Routes } from '@fc/user-dashboard';

import styles from './fraud-login.module.scss';

export const FraudLoginPage = React.memo(() => {
  const { expired } = useSafeContext<AccountContextState>(AccountContext);
  const location = useLocation();

  const [breakpointLg, breakpointSm] = useStylesVariables(['breakpoint-lg', 'breakpoint-sm']);

  const gtDesktop = useStylesQuery({ minWidth: breakpointLg });
  const gtMobile = useStylesQuery({ minWidth: breakpointSm });

  const { search = '' } = location.state?.from ?? {};

  const fraudSupportFormUrl = getFraudSupportFormUrl(search);

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
        Pour signaler un cas d’usurpation d’identité, veuillez vous connecter
      </h1>
      <LoginFormComponent
        className="flex-rows items-center"
        connectType={ConnectTypes.FRANCE_CONNECT}
        redirectUrl={`${Routes.FRAUD_FORM}${search}`}
      />
      <p
        className={classnames(styles.paragraph, 'fr-m-auto fr-mt-7v fr-mb-3w')}
        data-testid="paragraph">
        Une fois connecté, vous pourrez contacter le support FranceConnect en remplissant un
        formulaire.
      </p>
      <LinkComponent
        dataTestId="fraud-support-form-link"
        href={fraudSupportFormUrl}
        label="Je ne peux pas me connecter"
      />
    </div>
  );
});

FraudLoginPage.displayName = 'FraudLoginPage';

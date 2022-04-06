import { useContext } from 'react';
import { Redirect } from 'react-router-dom';

import { useApiGet } from '@fc/common';
import { RedirectToIdpFormComponent } from '@fc/oidc-client';
import { AppContext, AppContextInterface } from '@fc/state-management';

import { ButtonFranceConnectComponent } from '../../components';

export const HomePage = (): JSX.Element => {
  const csrf = useApiGet<{ csrfToken: string }>({ endpoint: '/api/csrf-token' });

  const { state } = useContext<AppContextInterface>(AppContext);
  const isConnected = state && state.user && state.user.userinfos;
  if (isConnected) {
    // @TODO
    // the auth route pattern should be implemented
    // for manage as a generic way on all pages
    // @SEE https://v5.reactrouter.com/web/example/auth-workflow
    return <Redirect to="/history" />;
  }

  return (
    <div className="content-wrapper-lg text-center" id="page-container">
      <h1 className="is-blue-france is-bold mb32">
        Pour accéder à votre historique d&apos;utilisation de FranceConnect, veuillez vous connecter
      </h1>
      {csrf && (
        <RedirectToIdpFormComponent csrf={csrf.csrfToken} id="login-form">
          <ButtonFranceConnectComponent type="submit" />
        </RedirectToIdpFormComponent>
      )}
      <p className="mt32 fs14 lh24" data-testid="paragraph">
        Une fois connecté, vous pourrez accéder à l&apos;ensemble des connexions et échanges de
        données liés à votre compte sur les 6 derniers mois.
      </p>
    </div>
  );
};

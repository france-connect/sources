import { RedirectToIdpFormComponent } from '@fc/oidc-client';

import { ButtonFranceConnectComponent } from '../../components';
import { useApiGet } from '@fc/common';

const HomePage = (): JSX.Element => {
  const csrf = useApiGet<{ csrfToken: string }>({
    endpoint: '/api/csrf-token',
  });

  return (
    <div className="content-wrapper-lg text-center" id="page-container">
      <h1 className="is-blue-france is-bold mb32">
        Pour accéder à votre historique d&apos;utilisation de FranceConnect,
        veuillez vous connecter
      </h1>

      {csrf && (
        <RedirectToIdpFormComponent id="login-form" csrf={csrf.csrfToken}>
          <ButtonFranceConnectComponent type="submit" />
        </RedirectToIdpFormComponent>
      )}
      <p className="mt32">
        Une fois connecté, vous pourrez accéder à l&apos;ensemble des connexions
        et échanges de données liés à votre compte sur les 6 derniers mois.
      </p>
    </div>
  );
};

export default HomePage;

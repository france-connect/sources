import classnames from 'classnames';

import { ConnectTypes } from '@fc/dsfr';
import { LoginFormComponent } from '@fc/login-form';
import { useStylesQuery, useStylesVariables } from '@fc/styles';

export const LoginPage = () => {
  const [breakpointLg] = useStylesVariables(['breakpoint-lg']);

  const gtDesktop = useStylesQuery({ minWidth: breakpointLg });

  return (
    <main className="fr-container fr-py-8v">
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
          <h1>Mon espace partenaires</h1>
          <h2 className="fr-mt-4w">
            Centralisez toutes les étapes d’implémentation de FranceConnect sur votre fournisseur de
            service.
          </h2>
          <LoginFormComponent
            className="flex-rows items-start"
            connectType={ConnectTypes.AGENT_CONNECT}
          />
        </div>
      </div>
    </main>
  );
};

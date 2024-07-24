/* istanbul ignore file */

// declarative file
import classnames from 'classnames';

import { useStylesQuery, useStylesVariables } from '@fc/styles';

export const HomePage = () => {
  const [breakpointLg] = useStylesVariables(['breakpoint-lg', 'breakpoint-sm']);

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
          <div className="fr-mt-8w fr-connect-group">
            <button className="fr-connect" data-testid="login-button">
              <span className="fr-connect__login">S’identifier avec</span>
              <span className="fr-connect__brand">AgentConnect</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

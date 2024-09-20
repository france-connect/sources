/* istanbul ignore file */

// declarative file
import classnames from 'classnames';

import { useStylesQuery, useStylesVariables } from '@fc/styles';

export const HomePage = () => {
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
        <div className="fr-col-12">Vous êtes connecté</div>
      </div>
    </main>
  );
};

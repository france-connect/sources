import classnames from 'classnames';
import React from 'react';
import { useMediaQuery } from 'react-responsive';

import styles from './error.module.scss';

export const PublicnessErrorComponent = React.memo(() => {
  const gtTablet = useMediaQuery({ query: '(min-width: 768px)' });

  return (
    <div
      className={classnames(styles.page, 'fr-m-auto', {
        // Class CSS
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'fr-mt-4w': !gtTablet,
        // Class CSS
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'fr-mt-8w': gtTablet,
      })}>
      <h2
        className={classnames(styles.title, 'fr-text--bold fr-px-2w', {
          // Class CSS
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'text-center': gtTablet,
          // Class CSS
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'text-left': !gtTablet,
        })}>
        Accès impossible
      </h2>
      <div className="fr-mx-auto fr-my-4w fr-px-2w fr-text--lg">
        <p className="fr-mb-4w">Ce service est réservé aux agents de la Fonction Publique.</p>
        <p className="fr-mb-4w">
          Vous êtes rattaché à une organisation de droit privé. Vous ne pouvez pas y avoir accès.
        </p>
      </div>
    </div>
  );
});

PublicnessErrorComponent.displayName = 'ErrorComponent';

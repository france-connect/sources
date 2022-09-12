import classnames from 'classnames';
import React from 'react';
import { useMediaQuery } from 'react-responsive';

import { IError } from '../../../types/error.type';
import styles from './error.module.scss';

interface ErrorComponentProps {
  errors: IError;
}

export const ErrorComponent = React.memo(({ errors }: ErrorComponentProps) => {
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
      <h1
        className={classnames(styles.title, 'fr-text--bold fr-px-2w', {
          // Class CSS
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'text-center': gtTablet,
          // Class CSS
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'text-left': !gtTablet,
        })}>
        Une erreur est survenue lors de la connexion.
      </h1>
      <div className="fr-mx-auto fr-my-4w fr-px-2w fr-text--lg">
        <p className="fr-mb-4w fr-text--bold">Description de l’erreur :</p>
        <p className="fr-mb-8w" data-testid="error-message">
          {errors.message}
        </p>
        <p className="fr-mb-4w fr-text--bold">Que faire ?</p>
        <p className="fr-mb-4w">
          Fermez l’onglet de votre navigateur et reconnectez-vous en cliquant sur le bouton
          AgentConnect.
        </p>
        <p className="fr-mb-4w">Contactez le support de votre service si le problème persiste.</p>
        <div className={classnames(styles.details, 'fr-p-3w')}>
          <p>
            Informations à nous transmettre dans le mail pour faciliter la prise en charge de votre
            demande :
          </p>
          <p data-testid="error-code">
            <strong>Code d’erreur :</strong> {errors.code}
          </p>
          <p className="fr-my-0" data-testid="error-session-id">
            <strong>ID :</strong> {errors.id}
          </p>
        </div>
      </div>
    </div>
  );
});

ErrorComponent.displayName = 'ErrorComponent';

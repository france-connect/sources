import './error.scss';

import classnames from 'classnames';
import React from 'react';
import { useMediaQuery } from 'react-responsive';

import { IError } from '../../types/error.type';

interface ErrorComponentProps {
  errors: IError;
}

export const ErrorComponent = React.memo(({ errors }: ErrorComponentProps) => {
  const gtTablet = useMediaQuery({ query: '(min-width: 768px)' });

  return (
    <div>
      <h1
        className={classnames('is-blue-agentconnect is-bold px16', {
          // Class CSS
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'text-center': gtTablet,
          // Class CSS
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'text-left': !gtTablet,
        })}>
        Une erreur est survenue lors de la connexion.
      </h1>
      <div className="ErrorComponent margin-x-auto my32 px16 fr-text-lg">
        <p className="mb32 is-bold">Description de l’erreur :</p>
        <p className="mb32" data-testid="error-message">
          {errors.message}
        </p>
        <p className="mb32 is-bold">Que faire ?</p>
        <p className="mb32">
          Fermez l’onglet de votre navigateur et reconnectez-vous en cliquant sur le bouton
          AgentConnect.
        </p>
        <p className="mb32">Contactez le support de votre service si le problème persiste.</p>
        <div className="bg-blue-france-100 p24">
          <p>
            Informations à nous transmettre dans le mail pour faciliter la prise en charge de votre
            demande :
          </p>
          <p data-testid="error-code">
            <strong>Code d’erreur :</strong> {errors.code}
          </p>
          <p data-testid="error-session-id">
            <strong>ID :</strong> {errors.id}
          </p>
        </div>
      </div>
    </div>
  );
});

ErrorComponent.displayName = 'ErrorComponent';

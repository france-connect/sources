/* istanbul ignore file */

/**
 * Not yet implemented
 */
import classnames from 'classnames';
import { useMediaQuery } from 'react-responsive';

const ErrorPage = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 425px)' });

  return (
    <div>
      <h1
        className={classnames('is-blue-agentconnect', {
          'text-center': !isMobile,
          'text-left': isMobile,
        })}
      >
        Une erreur est survenue lors de la connexion.
      </h1>
      <div
        className={classnames('content-wrapper-sm my32 px120 fr-text-lg', {
          'no-no-padding': isMobile,
        })}
      >
        <p className="mb32">Description de l’erreur :</p>
        <p className="mb32">
          Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem
          ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
        </p>
        <p className="mb32">Que faire ? </p>
        <p className="mb32">
          Fermez l’onglet de votre navigateur et reconnectez-vous en cliquant
          sur le bouton AgentConnect.
        </p>
        <p className="mb32">
          Contactez le support de votre service si le problème persiste.
        </p>
        <div className="bg-blue-france-100 p24">
          <p>
            Informations à nous transmettre dans le mail pour faciliter la prise
            en charge de votre demande :
          </p>
          <p>
            <strong>Code d’erreur :</strong> 04515
          </p>
          <p>
            <strong>ID :</strong> 2558632862785
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;

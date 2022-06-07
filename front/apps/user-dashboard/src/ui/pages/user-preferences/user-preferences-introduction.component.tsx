import classnames from 'classnames';
import React from 'react';
import { useMediaQuery } from 'react-responsive';

import styles from './user-preferences-introduction.module.scss';

export const UserPreferencesIntroductionComponent: React.FC = React.memo(() => {
  const gtMobile = useMediaQuery({ query: '(min-width: 576px)' });
  const gtDesktop = useMediaQuery({ query: '(min-width: 992px)' });
  const imageWidth = gtMobile ? 350 : '100%';

  return (
    <React.Fragment>
      <h1 className={classnames(styles.title, 'fr-h3 fr-mb-2w fr-text--bold')}>
        Pourquoi gérer mes accès dans FranceConnect&nbsp;?
      </h1>
      <p className="is-normal fr-mb-5v">
        Pour mieux contr&ocirc;ler votre usage de FranceConnect et vous prot&eacute;ger en cas de
        vols de vos identifiants, vous pouvez bloquer l&rsquo;utilisation des comptes que vous
        n&rsquo;utilisez pas.&nbsp;
        <strong>
          Ils seront toujours visibles sur la page de s&eacute;lection de compte mais FranceConnect
          emp&ecirc;chera la connexion d&rsquo;aboutir.&nbsp;
        </strong>
        Vous pourrez les r&eacute;activer &agrave; n&rsquo;importe quel moment depuis cette page.
      </p>
      <p className="is-normal">
        Ces comptes resteront disponibles sur leur service d&rsquo;origine, par exemple&nbsp;:&nbsp;
        <strong>
          si vous bloquez le compte Imp&ocirc;ts dans FranceConnect, votre compte Imp&ocirc;ts reste
          utilisable sur le site impots.gouv.fr sans passer par FranceConnect.
        </strong>
      </p>
      <p className={classnames(styles.title, 'fr-h6 fr-mt-4w fr-mb-2w fr-text--bold')}>
        En images&nbsp;:
      </p>
      <div
        className={classnames('flex-wrapper', {
          // Class CSS
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'flex-between': gtDesktop,
          // Class CSS
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'flex-center': !gtMobile,
          // Class CSS
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'text-center': !gtDesktop && gtMobile,
        })}>
        <div
          className={classnames(styles.tutoriel, {
            // Class CSS
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'fr-mb-3w': !gtDesktop,
            // Class CSS
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'fr-mb-5w': gtDesktop,
          })}>
          <strong className="fr-text--md is-block fr-mb-1w">
            1. Un usurpateur tente de se connecter à Service-Public.fr
          </strong>
          <img
            alt="Tentative de connexion"
            className="shadow-bottom"
            src="/images/user-preferences-tutoriel-01.png"
            width={imageWidth}
          />
        </div>
        <div
          className={classnames(styles.tutoriel, {
            // Class CSS
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'fr-mb-3w': !gtDesktop,
            // Class CSS
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'fr-mb-5w': gtDesktop,
          })}>
          <strong className="fr-text--md is-block fr-mb-1w">
            2. L&rsquo;usurpateur tente d&rsquo;utiliser un compte préalablement bloqué
          </strong>
          <img
            alt="Utilisation d'un compte bloqué"
            className="shadow-bottom"
            src="/images/user-preferences-tutoriel-02.png"
            width={imageWidth}
          />
        </div>
        <div
          className={classnames(styles.tutoriel, {
            // Class CSS
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'fr-mb-3w': !gtDesktop,
          })}>
          <strong className="fr-text--md is-block fr-mb-1w">
            3. L&rsquo;usurpateur parvient à s&rsquo;identifier
          </strong>
          <img
            alt="Identification"
            className="shadow-bottom"
            src="/images/user-preferences-tutoriel-03.png"
            width={imageWidth}
          />
        </div>
        <div className={classnames(styles.tutoriel)}>
          <strong className="fr-text--md is-block fr-mb-1w">
            4. FranceConnect bloque la connexion
          </strong>
          <img
            alt="Usurpateur bloqué"
            className="shadow-bottom"
            src="/images/user-preferences-tutoriel-04.png"
            width={imageWidth}
          />
        </div>
      </div>
    </React.Fragment>
  );
});

UserPreferencesIntroductionComponent.displayName = 'UserPreferencesIntroductionComponent';

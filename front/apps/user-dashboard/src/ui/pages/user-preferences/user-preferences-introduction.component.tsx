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
      <h2 className="is-h3 mb16 is-blue-france is-bold">
        Pourquoi gérer mes accès dans FranceConnect&nbsp;?
      </h2>
      <p className="is-normal fr-text mb20">
        Pour mieux contr&ocirc;ler votre usage de FranceConnect et vous prot&eacute;ger en cas de
        vols de vos identifiants, vous pouvez bloquer l&rsquo;utilisation des comptes que vous
        n&rsquo;utilisez pas.&nbsp;
        <strong>
          Ils seront toujours visibles sur la page de s&eacute;lection de compte mais FranceConnect
          emp&ecirc;chera la connexion d&rsquo;aboutir.&nbsp;
        </strong>
        Vous pourrez les r&eacute;activer &agrave; n&rsquo;importe quel moment depuis cette page.
      </p>
      <p className="is-normal fr-text">
        Ces comptes resteront disponibles sur leur service d&rsquo;origine, par exemple&nbsp;:&nbsp;
        <strong>
          si vous bloquez le compte Imp&ocirc;ts dans FranceConnect, votre compte Imp&ocirc;ts reste
          utilisable sur le site impots.gouv.fr sans passer par FranceConnect.
        </strong>
      </p>
      <h3 className="is-h6 mt32 mb16 is-blue-france is-bold">En images&nbsp;:</h3>
      <div
        className={classnames('flex-wrapper', {
          'flex-between': gtDesktop,
          'flex-center': !gtMobile,
          'text-center': !gtDesktop && gtMobile,
        })}>
        <div
          className={classnames(styles.tutoriel, {
            mb24: !gtDesktop,
            mb40: gtDesktop,
          })}>
          <strong className="fs16 lh24 is-block mb8">
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
            mb24: !gtDesktop,
            mb40: gtDesktop,
          })}>
          <strong className="fs16 lh24 is-block mb8">
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
            mb24: !gtDesktop,
          })}>
          <strong className="fs16 lh24 is-block mb8">
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
          <strong className="fs16 lh24 is-block mb8">4. FranceConnect bloque la connexion</strong>
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

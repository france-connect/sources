import classnames from 'classnames';
import React from 'react';

import { useStylesQuery, useStylesVariables } from '@fc/styles';

import { UserPreferencesTutorialComponent } from '../user-preferences-tutorial';
import styles from './user-preferences-introduction.module.scss';

export const UserPreferencesIntroductionComponent: React.FC = React.memo(() => {
  const [breakpointMd, breakpointLg] = useStylesVariables(['breakpoint-md', 'breakpoint-lg']);

  const gtTablet = useStylesQuery({ minWidth: breakpointMd });
  const gtDesktop = useStylesQuery({ minWidth: breakpointLg });

  return (
    <React.Fragment>
      <h1 className={classnames(styles.title, 'fr-h3 fr-mb-2w fr-text--bold')}>
        Pourquoi gérer mes accès dans FranceConnect&nbsp;?
      </h1>
      <p className="is-normal fr-mb-5v">
        Pour mieux contr&ocirc;ler votre usage de FranceConnect et vous prot&eacute;ger en cas de
        vol de vos identifiants, vous pouvez bloquer l&rsquo;utilisation des comptes que vous
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
          'flex-between': gtTablet,
          // Class CSS
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'flex-center': !gtTablet,
          // Class CSS
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'text-center': gtTablet && !gtDesktop,
        })}
        data-testid="user-preferences-introduction-container">
        <UserPreferencesTutorialComponent
          alt="Tentative de connexion"
          className={classnames({
            // Class CSS
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'fr-mb-3w': !gtDesktop,
            // Class CSS
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'fr-mb-5w': gtDesktop,
          })}
          img="/images/user-preferences-tutoriel-01.png"
          label="1. Un usurpateur tente de se connecter à Service-Public.fr"
        />
        <UserPreferencesTutorialComponent
          alt="Utilisation d'un compte bloqué"
          className={classnames({
            // Class CSS
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'fr-mb-3w': !gtDesktop,
            // Class CSS
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'fr-mb-5w': gtDesktop,
          })}
          img="/images/user-preferences-tutoriel-02.png"
          label="2. L’usurpateur tente d’utiliser un compte préalablement bloqué"
        />
        <UserPreferencesTutorialComponent
          alt="Identification"
          className={classnames({
            // Class CSS
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'fr-mb-3w': !gtDesktop,
          })}
          img="/images/user-preferences-tutoriel-03.png"
          label="3. L’usurpateur parvient à s’identifier"
        />
        <UserPreferencesTutorialComponent
          alt="Usurpateur bloqué"
          img="/images/user-preferences-tutoriel-04.png"
          label="4. FranceConnect bloque la connexion"
        />
      </div>
    </React.Fragment>
  );
});

UserPreferencesIntroductionComponent.displayName = 'UserPreferencesIntroductionComponent';

import { Helmet } from '@dr.pogodin/react-helmet';
import classnames from 'classnames';
import React from 'react';

import { useStylesQuery, useStylesVariables } from '@fc/styles';

export const AccessibilityPage = () => {
  const [breakpointLg] = useStylesVariables(['breakpoint-lg']);
  const gtDesktop = useStylesQuery({ minWidth: breakpointLg });
  return (
    <React.Fragment>
      <Helmet>
        <title>Mon tableau de bord - Déclaration d&rsquo;accessibilité</title>
      </Helmet>
      <div
        className={classnames('fr-container fr-py-8v', {
          // Class CSS
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'fr-mt-5w': !gtDesktop,
          // Class CSS
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'fr-mt-8w': gtDesktop,
        })}
        id="page-container">
        <h1>Déclaration d’accessibilité</h1>

        <section className="fr-my-6w">
          <p>
            La Direction Interministérielle du Numérique (DINUM) s’engage à rendre ses services
            accessibles conformément à l’article 47 de la loi n°2005-102 du 11 février 2005.
          </p>
          <p>Cette déclaration d’accessibilité s’applique au tableau de bord FranceConnect.</p>
        </section>

        <section className="fr-my-6w">
          <h2>État de conformité</h2>
          <p>
            Le service tableau de bord FranceConnect est <b>non conforme</b> avec le référentiel
            général d’amélioration de l’accessibilité (RGAA), version 4 en raison de l’absence de
            réalisation d’audit de conformité.
          </p>
        </section>

        <section className="fr-my-6w">
          <h2>Établissement de cette déclaration d’accessibilité</h2>
          <p>Cette déclaration a été établie le 13/10/2025.</p>
        </section>

        <section className="fr-my-6w">
          <h2>Technologies utilisées pour la réalisation du site</h2>
          <ul>
            <li>HTML5</li>
            <li>CSS3</li>
            <li>JavaScript</li>
          </ul>
        </section>

        <section className="fr-my-6w">
          <h2>Retour d’information et contact</h2>
          <p>
            Si vous n’arrivez pas à accéder à un contenu ou à un service, vous pouvez contacter le
            responsable de FranceConnect et de FranceConnect+ pour être orienté vers une alternative
            accessible ou obtenir le contenu sous une autre forme.
          </p>
          <p>
            Envoyer un message à
            <a
              href="mailto:accessibilite@franceconnect.gouv.fr"
              rel="noopener noreferrer"
              target="_blank">
              accessibilite@franceconnect.gouv.fr
            </a>
          </p>
        </section>

        <section className="fr-mt-6w">
          <h2>Voies de recours</h2>
          <p>
            Si vous constatez un défaut d’accessibilité vous empêchant d’accéder à un contenu ou une
            fonctionnalité du site, que vous nous le signalez et que vous ne parvenez pas à obtenir
            une réponse de notre part, vous êtes en droit de faire parvenir vos doléances ou une
            demande de saisine au Défenseur des droits.
          </p>
          <p>Plusieurs moyens sont à votre disposition&nbsp;:</p>
          <ul>
            <li>Écrire un message au Défenseur des droits</li>
            <li>Contacter le délégué du Défenseur des droits dans votre région</li>
            <li>
              <p>
                Envoyer un courrier par la poste (gratuit, ne pas mettre de timbre)&nbsp;:
                <br />
                Défenseur des droits
                <br />
                Libre réponse 71120
                <br />
                75342 Paris CEDEX 07
              </p>
            </li>
          </ul>
        </section>
      </div>
    </React.Fragment>
  );
};

AccessibilityPage.displayName = 'Accessibility';

import React from 'react';

import { MessageTypes } from '@fc/common';
import { AlertComponent, LinkComponent } from '@fc/dsfr';

export const IdentityTheftReportSuccessPage = React.memo(() => (
  <React.Fragment>
    <div className="fr-px-14w fr-py-6w fr-mb-8w fr-mt-6w fr-background-alt--grey">
      <AlertComponent
        dataTestId="success-alert"
        title="Votre demande a bien été prise en compte"
        type={MessageTypes.SUCCESS}>
        <p>
          Vous allez recevoir un message de confirmation à l’adresse électronique indiquée dans le
          formulaire.
        </p>
      </AlertComponent>
      <p className="fr-mt-3w fr-mb-0">
        Après vérification, le support FranceConnect se rapprochera du fournisseur de votre compte
        et du service accédé pour leur signaler l’usurpation d’identité.
      </p>
    </div>
    <h2>En complément du signalement, nous vous conseillons de&nbsp;:</h2>
    <ol className="fr-mb-9w">
      <li>
        changer le mot de passe du compte utilisé ( Impots.gouv.fr, ameli.fr, MSA ou TrustMe ) ou le
        code PIN protégeant l’identité numérique utilisée ( L’Identité Numérique La Poste, YRIS,
        France Identité) ;
      </li>
      <li>bloquer les comptes ou identités numériques que vous n’utilisez pas ;</li>
      <li>
        utiliser un compte plus sécurisée comme France Identité ou L’identité Numérique La Poste.
      </li>
    </ol>
    <h4>Voir aussi</h4>
    <p className="fr-mb-3w">
      <LinkComponent
        external
        href="https://aide.franceconnect.gouv.fr/faq/securite-confidentialite/articles/renforcement-securite/#faq-securite-confidentialite"
        label="Se protéger contre l’usurpation d’identité"
        title="Se protéger contre l’usurpation d’identité"
      />
    </p>
    <p className="fr-mb-3w">
      <LinkComponent
        external
        className="fr-mb-3w"
        href="https://aide.franceconnect.gouv.fr/faq/securite-confidentialite/articles/blocage-comptes-inutilis%C3%A9s/#faq-securite-confidentialite"
        label="Sécuriser mes accès à partir de mon tableau de bord "
        title="Sécuriser mes accès à partir de mon tableau de bord "
      />
    </p>
  </React.Fragment>
));

IdentityTheftReportSuccessPage.displayName = 'IdentityTheftReportSuccessPage';

import React from 'react';

export const IntroductionComponent = React.memo(() => (
  <div>
    <h1 className="fr-h3 is-blue-france fr-mb-1w">
      <b>Votre historique de connexion</b>
    </h1>
    <p>
      Retrouver toutes les connexions et échanges de données effectués via FranceConnect ces six
      derniers mois.
      <br />
      Cliquez sur une connexion pour en afficher les détails.
    </p>
  </div>
));

IntroductionComponent.displayName = 'IntroductionComponent';

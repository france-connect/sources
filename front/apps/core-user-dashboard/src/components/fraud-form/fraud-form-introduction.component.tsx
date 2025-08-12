import React from 'react';

export const FraudFormIntroductionComponent = React.memo(() => (
  <div>
    <h1 className="fr-h3 fr-text-title--blue-france fr-mb-1w">
      <b>Je signale une usurpation</b>
    </h1>
    <p>
      En remplissant ce formulaire, le support FranceConnect sera informé de votre demande. Nous
      vous recontacterons sous peu.
    </p>
  </div>
));

FraudFormIntroductionComponent.displayName = 'FraudFormIntroductionComponent';

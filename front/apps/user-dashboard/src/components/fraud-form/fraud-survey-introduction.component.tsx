import React from 'react';

import { SimpleButton } from '@fc/dsfr';
import { redirectToFraudSurvey } from '@fc/user-dashboard';

export const FraudSurveyIntroductionComponent = React.memo(() => (
  <div>
    <h1 className="fr-h3 is-blue-france fr-mb-1w">
      <b>Je signale une usurpation</b>
    </h1>
    <p>
      Vous recevez une alerte de connexion dont vous n’êtes pas à l’origine ?
      <br />
      Afin de vous protéger contre une éventuelle usurpation de votre identité, laissez-nous vous
      guider à sécuriser votre accès FranceConnect.
    </p>
    <SimpleButton
      dataTestId="fraud-survey-button"
      label="Commencer la vérification"
      onClick={redirectToFraudSurvey}
    />
  </div>
));

FraudSurveyIntroductionComponent.displayName = 'FraudSurveyIntroductionComponent';

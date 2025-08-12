import React from 'react';

import { redirectToFraudSurvey } from '@fc/core-user-dashboard';
import { SimpleButton } from '@fc/dsfr';

export const FraudSurveyIntroductionComponent = React.memo(() => (
  <div>
    <h1 className="fr-h3 fr-text-title--blue-france fr-mb-1w">
      <b>Je signale une usurpation</b>
    </h1>
    <p>
      Vous recevez une alerte de connexion dont vous n’êtes pas à l’origine ?
      <br />
      Afin de vous protéger contre une éventuelle usurpation de votre identité, laissez-nous vous
      guider à sécuriser votre accès FranceConnect.
    </p>
    <SimpleButton dataTestId="fraud-survey-button" onClick={redirectToFraudSurvey}>
      Commencer la vérification
    </SimpleButton>
  </div>
));

FraudSurveyIntroductionComponent.displayName = 'FraudSurveyIntroductionComponent';

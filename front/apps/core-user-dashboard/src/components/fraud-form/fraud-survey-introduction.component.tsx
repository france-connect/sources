import React from 'react';

import { redirectToFraudSurvey } from '@fc/core-user-dashboard';
import { SimpleButton } from '@fc/dsfr';
import { t } from '@fc/i18n';

export const FraudSurveyIntroductionComponent = React.memo(() => {
  const title = t('FraudForm.introduction.title');
  const description = t('FraudForm.survey.description');
  const button = t('FraudForm.survey.button');

  return (
    <div>
      <h1 className="fr-h3 fr-text-title--blue-france fr-mb-1w">
        <b>{title}</b>
      </h1>
      <p className="is-whitespace-prewrap">{description}</p>
      <SimpleButton dataTestId="fraud-survey-button" onClick={redirectToFraudSurvey}>
        {button}
      </SimpleButton>
    </div>
  );
});

FraudSurveyIntroductionComponent.displayName = 'FraudSurveyIntroductionComponent';

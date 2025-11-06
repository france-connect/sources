import React from 'react';

import { t } from '@fc/i18n';

export const FraudFormIntroductionComponent = React.memo(() => {
  const title = t('FraudForm.introduction.title');
  const description = t('FraudForm.introduction.description');

  return (
    <div>
      <h1 className="fr-h3 fr-text-title--blue-france fr-mb-1w">
        <b>{title}</b>
      </h1>
      <p>{description}</p>
    </div>
  );
});

FraudFormIntroductionComponent.displayName = 'FraudFormIntroductionComponent';

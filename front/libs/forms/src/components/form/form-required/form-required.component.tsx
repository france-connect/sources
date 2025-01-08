import React from 'react';

import { t } from '@fc/i18n';

export const FormRequiredMessageComponent = React.memo(() => (
  <p className="fr-text--sm fc-text-align--left-md-center">{t('Form.message.requiredFields')}</p>
));

FormRequiredMessageComponent.displayName = 'FormRequiredMessageComponent';

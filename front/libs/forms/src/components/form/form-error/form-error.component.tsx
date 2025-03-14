import React from 'react';

import { t } from '@fc/i18n';

import { FormErrorScrollComponent } from '../form-error-scroll';

interface FormErrorComponentProps {
  error?: string;
}

export const FormErrorComponent = React.memo(({ error }: FormErrorComponentProps) => (
  <React.Fragment>
    <div className="fr-alert fr-alert--error fr-alert--sm fr-mb-6w" role="alert">
      <h3 className="fr-alert__title">{t('Form.message.requestFailed')}</h3>
      {error && <p>{error}</p>}
    </div>
    <FormErrorScrollComponent active elementClassName=".fr-alert--error" />
  </React.Fragment>
));

FormErrorComponent.displayName = 'FormErrorComponent';

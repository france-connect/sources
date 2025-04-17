import React from 'react';

import { ButtonTypes, Priorities, SimpleButton, Sizes } from '@fc/dsfr';
import { t } from '@fc/i18n';

interface FormActionsComponentProps {
  canSubmit: boolean;
  size?: Sizes;
  showReset?: boolean;
  submitLabel?: string;
}

export const FormActionsComponent = React.memo(
  ({
    canSubmit,
    showReset = false,
    size = Sizes.MEDIUM,
    submitLabel = t('Form.submit'),
  }: FormActionsComponentProps) => (
    <div className="flex-end flex-columns">
      {showReset && (
        <SimpleButton
          className="fr-mr-1w"
          priority={Priorities.SECONDARY}
          size={size}
          type={ButtonTypes.RESET}>
          {t('Form.reset')}
        </SimpleButton>
      )}
      <SimpleButton disabled={!canSubmit} size={size} type={ButtonTypes.SUBMIT}>
        {submitLabel}
      </SimpleButton>
    </div>
  ),
);

FormActionsComponent.displayName = 'FormActionsComponent';

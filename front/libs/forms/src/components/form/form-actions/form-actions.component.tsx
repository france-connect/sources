import React, { useMemo } from 'react';

import { ButtonTypes, Priorities, SimpleButton, Sizes } from '@fc/dsfr';
import { t } from '@fc/i18n';

import type { FormActionsInterface } from '../../../interfaces';

interface FormActionsComponentProps {
  canSubmit: boolean;
  size?: Sizes;
  actions?: FormActionsInterface[];
}

const DEFAULT_ACTIONS: FormActionsInterface[] = [
  {
    disabled: ({ canSubmit }) => !canSubmit,
    label: 'Form.submit',
    type: ButtonTypes.SUBMIT,
  },
];

export const FormActionsComponent = React.memo(
  ({ actions = undefined, canSubmit, size = Sizes.MEDIUM }: FormActionsComponentProps) => {
    const buttons = useMemo(() => {
      const items = actions ?? DEFAULT_ACTIONS;
      const submittingButtons = items.filter(({ type }) => type === ButtonTypes.SUBMIT);

      const hasMoreThanOneSubmitButton = submittingButtons.length > 1;
      if (hasMoreThanOneSubmitButton) {
        throw new Error('FormActionsComponent: Only one button with type "submit" is allowed.');
      }

      const result = items.map(({ disabled, label, priority, type }, index) => {
        const key = `form-action-button::${type}-${index}`;
        const isDisabled = typeof disabled === 'function' ? disabled({ canSubmit }) : disabled;

        return (
          <SimpleButton
            key={key}
            className="fr-mr-1w"
            disabled={isDisabled}
            priority={priority ?? Priorities.PRIMARY}
            size={size}
            type={type}>
            {t(label)}
          </SimpleButton>
        );
      });
      return result;
    }, [actions, canSubmit, size]);

    return <div className="flex-end flex-columns">{buttons}</div>;
  },
);

FormActionsComponent.displayName = 'FormActionsComponent';

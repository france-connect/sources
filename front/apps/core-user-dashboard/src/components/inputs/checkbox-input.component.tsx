import classnames from 'classnames';
import React from 'react';
import { Field, useField } from 'react-final-form';

interface CheckboxInputComponentProps {
  label: string;
  name: string;
  validate: (value?: boolean) => string | undefined;
}

/**
 * @NOTE should be replaced when DTO2Form is implemented
 */
export const CheckboxInputComponent = React.memo(
  ({ label, name, validate }: CheckboxInputComponentProps) => {
    const metaField = useField(name, { subscription: { error: true, touched: true } });

    const error = metaField.meta.touched && metaField.meta.error;

    return (
      <Field name={name} type="checkbox" validate={validate}>
        {({ input }) => (
          <div
            className={classnames('fr-checkbox-group', {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              'fr-checkbox-group--error': !!error,
            })}>
            <input {...input} data-testid="field-checkbox-input" id={input.name} type="checkbox" />
            <label className="fr-label" data-testid="field-checkbox-label" htmlFor={input.name}>
              {label}
            </label>
            {!!error && (
              <p className="fr-message fr-message--error" id={`${input.name}-error-desc`}>
                {error}
              </p>
            )}
          </div>
        )}
      </Field>
    );
  },
);

CheckboxInputComponent.displayName = 'CheckboxInputComponent';

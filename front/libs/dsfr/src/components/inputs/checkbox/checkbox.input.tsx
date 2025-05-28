import React from 'react';
import { Field, useField } from 'react-final-form';

import { CheckboxComponent } from './checkbox.component';

interface CheckboxInputProps {
  // @SEE https://gouvfr.atlassian.net/wiki/spaces/DB/pages/217251933/Case+cocher+-+Checkbox
  disabled?: boolean;
  hint?: string;
  // @NOTE The initialValue is an argument from the react-final-Form library.
  // Its base type is `any`, so our wrapper must inherit from this type.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialValue?: any;
  label: string;
  name: string;
}

export const validateCheckbox = (value?: boolean) => {
  const msg = 'Veuillez cocher cette case si vous souhaitez continuer';
  return !value ? msg : undefined;
};

export const CheckboxInput = React.memo(
  ({ disabled = false, hint, initialValue, label, name }: CheckboxInputProps) => {
    const metaField = useField(name, { subscription: { error: true, touched: true } });

    const error = metaField.meta.touched && metaField.meta.error;

    return (
      <Field initialValue={initialValue} name={name} type="checkbox" validate={validateCheckbox}>
        {({ input }) => (
          <CheckboxComponent
            disabled={disabled}
            error={error}
            hint={hint}
            input={input}
            label={label}
          />
        )}
      </Field>
    );
  },
);

CheckboxInput.displayName = 'CheckboxInput';

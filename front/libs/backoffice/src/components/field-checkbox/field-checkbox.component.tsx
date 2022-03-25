import './field-checkbox.scss';

import React from 'react';
import { Field } from 'react-final-form';

import { Field as FieldProps, FieldOptions } from '../../interfaces';
import { FieldCheckboxInputComponent } from './field-checkbox-input.component';

interface FieldCheckboxComponentProps extends FieldProps, FieldOptions {
  label: string;
}

export const FieldCheckboxComponent: React.FC<FieldCheckboxComponentProps> = React.memo(
  ({ className, disabled, initialValue, label, name, rtl }: FieldCheckboxComponentProps) => (
    <Field initialValue={initialValue} name={name} type="checkbox">
      {({ input }) => (
        <FieldCheckboxInputComponent
          className={className}
          disabled={disabled}
          input={input}
          label={label}
          rtl={rtl}
        />
      )}
    </Field>
  ),
);

FieldCheckboxComponent.displayName = 'FieldCheckboxComponent';

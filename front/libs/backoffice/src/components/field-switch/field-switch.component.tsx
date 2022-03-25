import './field-switch.scss';

import React from 'react';
import { Field } from 'react-final-form';

import { Field as FieldProps, FieldBoolNode, FieldOptions } from '../../interfaces';
import { FieldSwitchInputComponent } from './field-switch-input.component';

interface FieldSwitchComponentProps extends FieldProps, FieldOptions {
  legend?: string | Function | FieldBoolNode;
}

export const FieldSwitchComponent: React.FC<FieldSwitchComponentProps> = React.memo(
  ({ className, disabled, initialValue, label, legend, name, rtl }: FieldSwitchComponentProps) => (
    <Field initialValue={initialValue} name={name} type="checkbox">
      {({ input }) => (
        <FieldSwitchInputComponent
          className={className}
          disabled={disabled}
          input={input}
          label={label}
          legend={legend}
          rtl={rtl}
        />
      )}
    </Field>
  ),
);

FieldSwitchComponent.defaultProps = {
  legend: { active: 'activé', inactive: 'désactivé' },
};

FieldSwitchComponent.displayName = 'FieldSwitchComponent';

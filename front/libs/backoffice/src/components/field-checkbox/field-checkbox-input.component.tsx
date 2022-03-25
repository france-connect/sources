import classnames from 'classnames';
import React from 'react';
import { FieldInputProps } from 'react-final-form';

import { FieldOptions } from '../../interfaces';
import { FieldCheckboxLabelComponent } from './field-checkbox-label.component';

interface FieldCheckboxInputComponentProps extends FieldOptions {
  // @NOTE la regle est desactivée car le type provient de la librairie react-final-form
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input: FieldInputProps<any, HTMLElement>;
  label: string;
}

export const FieldCheckboxInputComponent: React.FC<FieldCheckboxInputComponentProps> = React.memo(
  ({ className, disabled, input, label, rtl }: FieldCheckboxInputComponentProps) => (
    <div
      className={classnames('FieldCheckboxInputComponent', 'is-relative', className)}
      data-testid={`FieldCheckboxInputComponent-${input.name}`}>
      <input
        // @NOTE on autorise la destructuration des proprietes car
        // les propprietes fournies par react-final-form sont issues d'un contexte contrôlé
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...input}
        className="is-absolute opacity-0"
        data-testid="field-checkbox-input"
        disabled={disabled}
        id={input.name}
      />
      <FieldCheckboxLabelComponent
        checked={!!input.checked}
        disabled={disabled}
        label={label}
        name={input.name}
        rtl={rtl}
      />
    </div>
  ),
);

FieldCheckboxInputComponent.displayName = 'FieldCheckboxInputComponent';

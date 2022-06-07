import React from 'react';
import { Field } from 'react-final-form';

import { CheckableLegend } from '../../../interfaces';
import { ToggleComponent } from './toggle.component';

interface ToggleInputProps {
  // @SEE https://gouvfr.atlassian.net/wiki/spaces/DB/pages/368935138/Interrupteur+-+Toggle+switch
  disabled?: boolean;
  hint?: string;
  // @NOTE le initialValue est un argument provenant de la lib react-final-Form
  // son typage de base est `any`, notre wrapper est donc obligé d'hérité de ce type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialValue?: any;
  label: string | Function;
  name: string;
  className?: string;
  legend?: CheckableLegend;
}

export const ToggleInput: React.FC<ToggleInputProps> = React.memo(
  ({ className, disabled, hint, initialValue, label, legend, name }: ToggleInputProps) => (
    <Field initialValue={initialValue} name={name} type="checkbox">
      {({ input }) => (
        <ToggleComponent
          className={className}
          disabled={disabled}
          hint={hint}
          input={input}
          label={label}
          legend={legend}
        />
      )}
    </Field>
  ),
);

ToggleInput.defaultProps = {
  className: undefined,
  disabled: false,
  hint: undefined,
  initialValue: undefined,
  legend: undefined,
};

ToggleInput.displayName = 'ToggleInput';

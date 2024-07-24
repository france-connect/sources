import React from 'react';
import { Field } from 'react-final-form';

import { CheckboxComponent } from './checkbox.component';

interface CheckboxInputProps {
  // @SEE https://gouvfr.atlassian.net/wiki/spaces/DB/pages/217251933/Case+cocher+-+Checkbox
  disabled?: boolean;
  hint?: string;
  // @NOTE le initialValue est un argument provenant de la lib react-final-Form
  // son typage de base est `any`, notre wrapper est donc obligé d'hérité de ce type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialValue?: any;
  label: string;
  name: string;
}

export const CheckboxInput = React.memo(
  ({ disabled = false, hint, initialValue, label, name }: CheckboxInputProps) => (
    <Field initialValue={initialValue} name={name} type="checkbox">
      {({ input }) => (
        <CheckboxComponent disabled={disabled} hint={hint} input={input} label={label} />
      )}
    </Field>
  ),
);

CheckboxInput.displayName = 'CheckboxInput';

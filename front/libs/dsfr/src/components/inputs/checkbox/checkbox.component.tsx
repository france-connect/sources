import React from 'react';
import type { FieldInputProps } from 'react-final-form';

export interface CheckboxComponentProps {
  // @SEE https://gouvfr.atlassian.net/wiki/spaces/DB/pages/217251933/Case+cocher+-+Checkbox
  disabled?: boolean;
  hint?: string;
  // @NOTE la regle est desactivée car le type provient de la librairie react-final-form
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input: FieldInputProps<any, HTMLElement>;
  label: string;
}

export const CheckboxComponent: React.FC<CheckboxComponentProps> = React.memo(
  ({ disabled, hint, input, label }: CheckboxComponentProps) => (
    <div className="fr-checkbox-group">
      <input
        {...input}
        data-testid="field-checkbox-input"
        disabled={disabled}
        id={input.name}
        type="checkbox"
      />
      <label className="fr-label" data-testid="field-checkbox-label" htmlFor={input.name}>
        {label}
        {hint && <span className="fr-hint-text">{hint}</span>}
      </label>
    </div>
  ),
);

CheckboxComponent.defaultProps = {
  disabled: false,
  hint: undefined,
};

CheckboxComponent.displayName = 'CheckboxComponent';

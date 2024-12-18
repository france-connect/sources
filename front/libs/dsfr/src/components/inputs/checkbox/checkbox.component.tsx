import classnames from 'classnames';
import React from 'react';
import type { FieldInputProps } from 'react-final-form';

interface CheckboxComponentProps {
  // @SEE https://gouvfr.atlassian.net/wiki/spaces/DB/pages/217251933/Case+cocher+-+Checkbox
  disabled?: boolean;
  hint?: string;
  // @NOTE la regle est desactivée car le type provient de la librairie react-final-form
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input: FieldInputProps<any, HTMLElement>;
  label: string;
  error?: string;
}

export const CheckboxComponent = React.memo(
  ({ disabled = false, error, hint, input, label }: CheckboxComponentProps) => (
    <div
      className={classnames('fr-checkbox-group', {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'fr-checkbox-group--error': !!error,
      })}>
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
      {!!error && (
        <p className="fr-message fr-message--error" id={`${input.name}-error-desc`}>
          {error}
        </p>
      )}
    </div>
  ),
);

CheckboxComponent.displayName = 'CheckboxComponent';

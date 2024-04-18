import React from 'react';
import type { FieldInputProps } from 'react-final-form';

export interface ToggleInputComponentProps {
  disabled?: boolean;
  // @NOTE la regle est desactivée car le type provient de la librairie react-final-form
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input: FieldInputProps<any, HTMLElement>;
}

export const ToggleInputComponent: React.FC<ToggleInputComponentProps> = React.memo(
  ({ disabled, input }: ToggleInputComponentProps) => (
    <input
      {...input}
      aria-describedby={`${input.name}-hint-text`}
      className="fr-toggle__input"
      data-testid={`field-toggle-input-${input.name}`}
      disabled={disabled}
      id={input.name}
      type="checkbox"
      onChange={input.onChange}
    />
  ),
);

ToggleInputComponent.defaultProps = {
  disabled: false,
};

ToggleInputComponent.displayName = 'ToggleInputComponent';

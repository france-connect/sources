import React from 'react';
import type { FieldInputProps } from 'react-final-form';

import type { PropsWithClassName } from '@fc/common';

interface InputComponentProps<FieldValue = string> extends PropsWithClassName {
  readOnly?: boolean;
  disabled?: boolean;
  id: string;
  input: FieldInputProps<FieldValue, HTMLElement | HTMLSelectElement>;
}

export const InputComponent = React.memo(
  ({ className, disabled = false, id, input, readOnly = false }: InputComponentProps) => (
    <input
      {...input}
      aria-describedby={`${input.name}-messages`}
      className={className}
      data-testid={`${id}--testid`}
      disabled={disabled}
      id={id}
      name={input.name}
      readOnly={readOnly}
      type={input.type}
    />
  ),
);

InputComponent.displayName = 'InputComponent';

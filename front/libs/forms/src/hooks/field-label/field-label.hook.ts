import { Strings } from '@fc/common';

import type { PropsWithHintType } from '../../types';

interface FieldLabelProps extends PropsWithHintType {
  required?: boolean;
  label: string;
}

export const useFieldLabel = ({ hint = undefined, label, required = false }: FieldLabelProps) => {
  const nextHint = typeof hint === 'function' ? hint(required) : hint;

  const labelPrefix = !required
    ? Strings.EMPTY_STRING
    : `${Strings.WHITE_SPACE}${Strings.ASTERISK}`;

  const result = {
    hint: nextHint,
    label: `${label}${labelPrefix}`,
    required,
  };

  return result;
};

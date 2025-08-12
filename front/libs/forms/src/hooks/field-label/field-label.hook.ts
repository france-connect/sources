import { Strings } from '@fc/common';

import type { PropsWithHintType, PropsWithSeeAlsoType } from '../../types';

interface FieldLabelProps extends PropsWithHintType, PropsWithSeeAlsoType {
  required?: boolean;
  label: string;
}

export const useFieldLabel = ({
  hint = undefined,
  label,
  required = false,
  seeAlso = undefined,
}: FieldLabelProps) => {
  const nextHint = typeof hint === 'function' ? hint(required) : hint;

  const labelPrefix = !required
    ? Strings.EMPTY_STRING
    : `${Strings.WHITE_SPACE}${Strings.ASTERISK}`;

  const result = {
    hint: nextHint,
    label: `${label}${labelPrefix}`,
    required,
    seeAlso,
  };

  return result;
};

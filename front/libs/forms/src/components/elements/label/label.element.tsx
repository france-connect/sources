import classnames from 'classnames';
import React from 'react';

import { useFieldLabel } from '../../../hooks';
import type { PropsWithHintType } from '../../../types';

interface LabelElementProps extends PropsWithHintType {
  className?: string | undefined;
  name: string;
  required?: boolean;
  label: string;
}

export const LabelElement = React.memo(
  ({
    className = undefined,
    hint = undefined,
    label,
    name,
    required = false,
  }: LabelElementProps) => {
    const values = useFieldLabel({
      hint,
      label,
      required,
    });

    return (
      <label className={classnames('fr-label', className)} htmlFor={name}>
        {values.label}
        {values.hint && <span className="fr-hint-text">{values.hint}</span>}
      </label>
    );
  },
);

LabelElement.displayName = 'LabelElement';

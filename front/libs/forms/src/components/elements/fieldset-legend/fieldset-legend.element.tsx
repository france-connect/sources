import classnames from 'classnames';
import React from 'react';

import { useFieldLabel } from '../../../hooks';
import type { PropsWithHintType } from '../../../types';

interface FieldsetLegendElementProps extends PropsWithHintType {
  className?: string | undefined;
  name: string;
  label: string;
  required?: boolean;
}

export const FieldsetLegendElement = React.memo(
  ({ className = undefined, hint, label, name, required = false }: FieldsetLegendElementProps) => {
    const values = useFieldLabel({
      hint,
      label,
      required,
    });

    return (
      <legend
        className={classnames('fr-fieldset__legend--regular fr-fieldset__legend', className)}
        id={`${name}-legend`}>
        {values.label}
        {values.hint && <span className="fr-hint-text">{values.hint}</span>}
      </legend>
    );
  },
);

FieldsetLegendElement.displayName = 'FieldsetLegendElement';

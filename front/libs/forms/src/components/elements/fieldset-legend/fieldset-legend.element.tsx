import classnames from 'classnames';
import React from 'react';

import { useFieldLabel } from '../../../hooks';
import type { PropsWithHintType, PropsWithSeeAlsoType } from '../../../types';
import { SeeAlsoElement } from '../see-also';

interface FieldsetLegendElementProps extends PropsWithHintType, PropsWithSeeAlsoType {
  className?: string | undefined;
  name: string;
  label: string;
  required?: boolean;
  seeAlso?: string;
}

export const FieldsetLegendElement = React.memo(
  ({
    className = undefined,
    hint,
    label,
    name,
    required = false,
    seeAlso,
  }: FieldsetLegendElementProps) => {
    const values = useFieldLabel({
      hint,
      label,
      required,
      seeAlso,
    });

    return (
      <legend
        className={classnames('fr-fieldset__legend--regular fr-fieldset__legend', className)}
        id={`${name}-legend`}>
        {values.label}
        {(values.hint || values.seeAlso) && (
          <span className="fr-hint-text">
            {values.hint} <SeeAlsoElement id={name} url={seeAlso} />
          </span>
        )}
      </legend>
    );
  },
);

FieldsetLegendElement.displayName = 'FieldsetLegendElement';

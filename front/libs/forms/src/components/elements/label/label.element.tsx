import classnames from 'classnames';
import React from 'react';

import { useFieldLabel } from '../../../hooks';
import type { PropsWithHintType, PropsWithSeeAlsoType } from '../../../types';
import { SeeAlsoElement } from '../see-also';
import classes from './label.module.scss';

interface LabelElementProps extends PropsWithHintType, PropsWithSeeAlsoType {
  className?: string | undefined;
  name: string;
  required?: boolean;
  label: string;
  seeAlso?: string;
}

export const LabelElement = React.memo(
  ({
    className = undefined,
    hint = undefined,
    label,
    name,
    required = false,
    seeAlso = undefined,
  }: LabelElementProps) => {
    const values = useFieldLabel({
      hint,
      label,
      required,
    });

    return (
      <label className={classnames('fr-label', className)} htmlFor={name}>
        {values.label}
        {(values.hint || values.seeAlso) && (
          <span className={classnames(classes.labelHint, 'fr-hint-text')}>
            {values.hint} <SeeAlsoElement id={name} url={seeAlso} />
          </span>
        )}
      </label>
    );
  },
);

LabelElement.displayName = 'LabelElement';

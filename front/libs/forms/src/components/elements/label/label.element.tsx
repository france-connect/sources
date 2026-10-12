import classnames from 'classnames';
import React, { useId } from 'react';

import { useFieldLabel } from '../../../hooks';
import type { PropsWithHintType, PropsWithSeeAlsoType } from '../../../types';
import { SeeAlsoElement } from '../see-also';
import classes from './label.module.scss';

interface LabelElementProps extends PropsWithHintType, PropsWithSeeAlsoType {
  className?: string | undefined;
  htmlFor?: string;
  required?: boolean;
  label: string;
  seeAlso?: string;
}

export const LabelElement = React.memo(
  ({ className, hint, htmlFor, label, required = false, seeAlso }: LabelElementProps) => {
    const generatedId = useId();

    const values = useFieldLabel({
      hint,
      label,
      required,
    });

    const seeAlsoElementId = htmlFor ?? generatedId;

    return (
      <label className={classnames('fr-label', className)} htmlFor={htmlFor}>
        {values.label}
        {(values.hint || values.seeAlso) && (
          <span className={classnames(classes.labelHint, 'fr-hint-text')}>
            {values.hint} <SeeAlsoElement id={seeAlsoElementId} url={seeAlso} />
          </span>
        )}
      </label>
    );
  },
);

LabelElement.displayName = 'LabelElement';

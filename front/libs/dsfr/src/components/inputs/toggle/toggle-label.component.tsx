import classnames from 'classnames';
import type { JSX } from 'react';
import React from 'react';
import type { FieldInputProps } from 'react-final-form';

import { t } from '@fc/i18n';

import type { CheckableLegendInterface } from '../../../interfaces';
import styles from './toggle-label.module.scss';

interface ToggleLabelComponentProps {
  // @NOTE The rule is disabled because the type comes from the react-final-form library
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input: FieldInputProps<any, HTMLElement>;
  label: string | ((v: boolean) => string | JSX.Element);
  legend?: CheckableLegendInterface;
}

export const ToggleLabelComponent = React.memo(
  ({ input, label, legend = undefined }: ToggleLabelComponentProps) => {
    const defaultCheckedLabel = t('DSFR.toggle.checked');
    const defaultUncheckedLabel = t('DSFR.toggle.unchecked');

    const checkedLabel = legend?.checked || defaultCheckedLabel;
    const uncheckedLabel = legend?.unchecked || defaultUncheckedLabel;

    const isLabelString = typeof label === 'string';
    const isLabelFunction = typeof label === 'function';
    return (
      <label
        className={classnames('fr-toggle__label', styles.label)}
        data-fr-checked-label={checkedLabel}
        data-fr-unchecked-label={uncheckedLabel}
        data-testid={`field-toggle-label-${input.name}`}
        htmlFor={input.name}>
        {isLabelString && label}
        {isLabelFunction && label(!!input.checked)}
      </label>
    );
  },
);

ToggleLabelComponent.displayName = 'ToggleLabelComponent';

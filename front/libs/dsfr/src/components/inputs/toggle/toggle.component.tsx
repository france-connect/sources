import classnames from 'classnames';
import type { JSX } from 'react';
import React from 'react';
import type { FieldInputProps } from 'react-final-form';

import type { PropsWithClassName } from '@fc/common';

import type { CheckableLegendInterface } from '../../../interfaces';
import { ToggleInputComponent } from './toggle-input.component';
import { ToggleLabelComponent } from './toggle-label.component';

interface ToggleComponentProps extends PropsWithClassName {
  // @SEE https://gouvfr.atlassian.net/wiki/spaces/DB/pages/217251933/Case+cocher+-+Checkbox
  disabled?: boolean;
  hint?: string;
  // @NOTE The rule is disabled because the type comes from the react-final-form library
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input: FieldInputProps<any, HTMLElement>;
  label: string | ((v: boolean) => string | JSX.Element);
  onUpdate?: (v: boolean) => void;
  legend: CheckableLegendInterface | undefined;
}

export const ToggleComponent = React.memo(
  ({
    className,
    disabled = false,
    hint,
    input,
    label,
    legend,
    onUpdate = undefined,
  }: ToggleComponentProps) => (
    <div className={classnames('fr-toggle', className)}>
      <ToggleInputComponent disabled={disabled} input={input} onUpdate={onUpdate} />
      <ToggleLabelComponent input={input} label={label} legend={legend} />
      {hint && (
        <p className="fr-hint-text" id={`${input.name}-hint-text`}>
          {hint}
        </p>
      )}
    </div>
  ),
);

ToggleComponent.displayName = 'ToggleComponent';

import classnames from 'classnames';
import React from 'react';
import type { FieldInputProps } from 'react-final-form';

import type { CheckableLegend } from '../../../interfaces';
import { ToggleInputComponent } from './toggle-input.component';
import { ToggleLabelComponent } from './toggle-label.component';

export interface ToggleComponentProps {
  // @SEE https://gouvfr.atlassian.net/wiki/spaces/DB/pages/217251933/Case+cocher+-+Checkbox
  disabled?: boolean;
  hint?: string;
  // @NOTE la regle est desactivée car le type provient de la librairie react-final-form
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input: FieldInputProps<any, HTMLElement>;
  label: string | Function;
  className?: string;
  legend: CheckableLegend | undefined;
}

export const ToggleComponent: React.FC<ToggleComponentProps> = React.memo(
  ({ className, disabled, hint, input, label, legend }: ToggleComponentProps) => (
    <div className={classnames('fr-toggle', className)}>
      <ToggleInputComponent disabled={disabled} input={input} />
      <ToggleLabelComponent input={input} label={label} legend={legend} />
      {hint && (
        <p className="fr-hint-text" id={`${input.name}-hint-text`}>
          {hint}
        </p>
      )}
    </div>
  ),
);

ToggleComponent.defaultProps = {
  className: undefined,
  disabled: false,
  hint: undefined,
};

ToggleComponent.displayName = 'ToggleComponent';

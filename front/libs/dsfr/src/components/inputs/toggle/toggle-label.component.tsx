import React from 'react';
import type { FieldInputProps } from 'react-final-form';

import type { CheckableLegend } from '../../../interfaces';

export interface ToggleLabelComponentProps {
  // @NOTE la regle est desactivée car le type provient de la librairie react-final-form
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input: FieldInputProps<any, HTMLElement>;
  label: string | Function;
  legend?: CheckableLegend;
}

const defaultLegend = { checked: 'Activé', unchecked: 'Désactivé' };

export const ToggleLabelComponent: React.FC<ToggleLabelComponentProps> = React.memo(
  ({ input, label, legend = defaultLegend }: ToggleLabelComponentProps) => {
    const isLabelString = typeof label === 'string';
    const isLabelFunction = typeof label === 'function';
    return (
      <label
        className="fr-toggle__label"
        data-fr-checked-label={legend.checked}
        data-fr-unchecked-label={legend.unchecked}
        data-testid={`field-toggle-label-${input.name}`}
        htmlFor={input.name}>
        {isLabelString && label}
        {isLabelFunction && label(input.checked)}
      </label>
    );
  },
);

ToggleLabelComponent.defaultProps = {
  legend: undefined,
};

ToggleLabelComponent.displayName = 'ToggleLabelComponent';

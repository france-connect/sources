import React from 'react';

import { FieldBoolNode } from '../../interfaces';

interface FieldSwitchLegendComponentProps {
  legend?: string | Function | FieldBoolNode;
  checked?: boolean;
}

export const FieldSwitchLegendComponent: React.FC<FieldSwitchLegendComponentProps> = React.memo(
  ({ checked, legend }: FieldSwitchLegendComponentProps) => {
    // @TODO refacto avec l'ajout de composants type input form
    // refacto possible egalement lors de la separation DSFR CSS/DSFR Composants
    const isLegendString = typeof legend === 'string';
    const isLegendFunction = typeof legend === 'function';
    const isLegendObject =
      !isLegendString && !isLegendFunction && legend && legend.active && legend.inactive;
    return (
      <span className="FieldSwitchInputComponent-legend fs12 lh20 mt2 is-absolute">
        {isLegendString && legend}
        {isLegendFunction && legend(checked)}
        {isLegendObject && (
          <React.Fragment>
            {checked && legend.active}
            {!checked && legend.inactive}
          </React.Fragment>
        )}
      </span>
    );
  },
);

FieldSwitchLegendComponent.defaultProps = {
  checked: false,
  legend: { active: 'activé', inactive: 'désactivé' },
};

FieldSwitchLegendComponent.displayName = 'FieldSwitchLegendComponent';

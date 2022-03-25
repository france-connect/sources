import './field-switch.scss';

import classnames from 'classnames';
import React from 'react';
import { FieldInputProps } from 'react-final-form';

import { FieldBoolNode, FieldOptions } from '../../interfaces';
import { FieldSwitchLabelComponent } from './field-switch-label.component';
import { FieldSwitchLegendComponent } from './field-switch-legend.component';
import { FieldSwitchToggleButtonComponent } from './field-switch-toggle-button.component';

interface FieldSwitchInputComponentProps extends FieldOptions {
  // @NOTE la regle est desactivée car le type provient de la librairie react-final-form
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input: FieldInputProps<any, HTMLElement>;
  legend?: string | Function | FieldBoolNode;
}

export const FieldSwitchInputComponent: React.FC<FieldSwitchInputComponentProps> = React.memo(
  ({ className, disabled, input, label, legend, rtl }: FieldSwitchInputComponentProps) => (
    <div
      className={classnames('FieldSwitchInputComponent is-relative', className, {
        checked: input.checked,
        disabled,
        rtl,
      })}
      data-testid={`FieldSwitchInputComponent-${input.name}`}>
      <input
        // @NOTE on autorise la destructuration des proprietes car
        // les propprietes fournies par react-final-form sont issues d'un contexte contrôlé
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...input}
        className="is-absolute opacity-0"
        data-testid="field-switch-input"
        disabled={disabled}
        id={input.name}
      />
      <FieldSwitchLabelComponent checked={input.checked} label={label} name={input.name} rtl={rtl}>
        <FieldSwitchToggleButtonComponent checked={input.checked} />
      </FieldSwitchLabelComponent>
      {legend && <FieldSwitchLegendComponent checked={input.checked} legend={legend} />}
    </div>
  ),
);

FieldSwitchInputComponent.defaultProps = {
  legend: { active: 'activé', inactive: 'désactivé' },
};

FieldSwitchInputComponent.displayName = 'FieldSwitchInputComponent';

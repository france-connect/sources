import classnames from 'classnames';
import React from 'react';

interface FieldSwitchLabelComponentProps {
  label?: string | Function;
  name: string;
  checked?: boolean;
  children: React.ReactNode;
  rtl?: boolean;
}

export const FieldSwitchLabelComponent: React.FC<FieldSwitchLabelComponentProps> = React.memo(
  ({ checked, children, label, name, rtl }: FieldSwitchLabelComponentProps) => {
    // @TODO refacto avec l'ajout de composants type input form
    // refacto possible egalement lors de la separation DSFR CSS/DSFR Composants
    const labelIsString = typeof label === 'string';
    const labelIsFunction = typeof label === 'function';
    const classes = {
      ml24: !rtl,
      mr24: rtl,
    };
    return (
      <label className="FieldSwitchInputComponent-label flex-columns items-start" htmlFor={name}>
        {!rtl && children}
        {label && (
          <span className={classnames('lh24 fs14', classes)}>
            {labelIsString && label}
            {labelIsFunction && label(checked)}
          </span>
        )}
        {rtl && children}
      </label>
    );
  },
);

FieldSwitchLabelComponent.defaultProps = {
  checked: false,
  label: undefined,
  rtl: false,
};

FieldSwitchLabelComponent.displayName = 'FieldSwitchLabelComponent';

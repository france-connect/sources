import classnames from 'classnames';
import React from 'react';
import { RiCheckLine as CheckIcon } from 'react-icons/ri';

interface FieldCheckboxLabelComponentProps {
  label: string;
  name: string;
  checked: boolean;
  disabled?: boolean;
  rtl?: boolean;
}

export const FieldCheckboxLabelComponent: React.FC<FieldCheckboxLabelComponentProps> = React.memo(
  ({ checked, disabled, label, name, rtl }: FieldCheckboxLabelComponentProps) => (
    <label
      className={classnames('flex-columns flex-start items-center', { disabled })}
      htmlFor={name}>
      {rtl && <span className="mr12">{label}</span>}
      <span
        aria-hidden
        className={classnames('FieldCheckboxComponent-checkbox', 'text-center is-inline-block', {
          'bg-blue-france': checked,
          'is-white': checked,
        })}
        data-testid="check-box">
        {checked && <CheckIcon data-testid="check-icon" />}
      </span>
      {!rtl && <span className="ml12">{label}</span>}
    </label>
  ),
);

FieldCheckboxLabelComponent.defaultProps = {
  disabled: false,
  rtl: false,
};

FieldCheckboxLabelComponent.displayName = 'FieldCheckboxLabelComponent';

import React from 'react';
import { IconType } from 'react-icons';
import { RiCheckLine as CheckedIcon, RiCloseLine as UncheckedIcon } from 'react-icons/ri';

interface FieldSwitchToggleButtonComponentProps {
  checked?: boolean;
  icons?: { active: IconType | undefined; inactive: IconType | undefined } | false;
}

export const FieldSwitchToggleButtonComponent: React.FC<FieldSwitchToggleButtonComponentProps> =
  React.memo(({ checked, icons }: FieldSwitchToggleButtonComponentProps) => {
    let Icon = null;
    if (icons) {
      Icon = checked ? icons.active : icons.inactive;
    }
    return (
      <div aria-hidden className="FieldSwitchInputComponent-toggle-button is-relative">
        <span className="FieldSwitchInputComponent-toggle-thumb is-absolute text-center">
          {Icon && <Icon className="FieldSwitchInputComponent-icon" />}
        </span>
      </div>
    );
  });

FieldSwitchToggleButtonComponent.defaultProps = {
  checked: false,
  icons: { active: CheckedIcon, inactive: UncheckedIcon },
};

FieldSwitchToggleButtonComponent.displayName = 'FieldSwitchToggleButtonComponent';

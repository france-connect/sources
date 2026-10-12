import React from 'react';

import { Sizes } from '../../../enums';
import { CheckboxComponent } from '../../checkbox';

interface TableRowSelectComponentProps {
  checked: boolean;
  disabled?: boolean;
  id: string;
  label: string;
  onChange: (checked: boolean) => void;
}

export const TableRowSelectComponent = React.memo(
  ({ checked, disabled = false, id, label, onChange }: TableRowSelectComponentProps) => (
    <CheckboxComponent
      rowSelect
      checked={checked}
      dataTestId={`${id}-row-select`}
      disabled={disabled}
      id={id}
      label={label}
      size={Sizes.SMALL}
      onChange={onChange}
    />
  ),
);

TableRowSelectComponent.displayName = 'TableRowSelectComponent';

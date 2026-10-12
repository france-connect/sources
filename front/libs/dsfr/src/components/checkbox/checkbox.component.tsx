import classnames from 'classnames';

import type { SelectionTypes } from '../../enums';
import { Sizes } from '../../enums';
import { useCheckbox } from '../../hooks/checkbox/checkbox.hook';

interface CheckboxComponentProps {
  checked: boolean;
  classNames?: {
    group?: string;
    input?: string;
    label?: string;
  };
  disabled?: boolean;
  id: string;
  indeterminate?: boolean;
  rowSelect?: boolean;
  onChange: (checked: boolean) => void;
  selection?: SelectionTypes;
  size?: Sizes;
  ariaLabel?: string;
  label?: string;
  dataTestId?: string;
}

/**
 * @NOTE This component is used to display a checkbox.
 * It should not be used inside a form.
 * To use a checkbox in a form,
 * Use the {@link ConsentField} {@link Forms} component instead.
 */
export const CheckboxComponent = ({
  ariaLabel,
  checked,
  classNames,
  dataTestId,
  disabled = false,
  id,
  indeterminate = false,
  label,
  onChange,
  rowSelect = false,
  selection,
  size = Sizes.MEDIUM,
}: CheckboxComponentProps) => {
  const { ariaChecked, dataRowSelect, handleChange, inputRef } = useCheckbox({
    checked,
    indeterminate,
    onChange,
    rowSelect,
    selection,
  });

  return (
    <div
      className={classnames(
        'fr-checkbox-group',
        size && `fr-checkbox-group--${size}`,
        classNames?.group,
      )}
      data-testid={dataTestId}>
      <input
        ref={inputRef}
        aria-checked={ariaChecked}
        aria-label={ariaLabel}
        checked={checked}
        className={classnames('fr-checkbox', classNames?.input)}
        data-fr-row-select={dataRowSelect}
        data-testid={dataTestId && `${dataTestId}--input`}
        disabled={disabled}
        id={id}
        type="checkbox"
        onChange={handleChange}
      />
      {label && (
        <label
          className={classnames('fr-label', classNames?.label)}
          data-testid={dataTestId && `${dataTestId}--label`}
          htmlFor={id}>
          {label}
        </label>
      )}
    </div>
  );
};

import type { ChangeEvent } from 'react';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { SelectionTypes } from '../../enums';

export const useCheckbox = ({
  checked,
  indeterminate = false,
  onChange,
  rowSelect,
  selection,
}: {
  checked: boolean;
  indeterminate?: boolean;
  rowSelect: boolean;
  onChange: (checked: boolean) => void;
  selection?: SelectionTypes;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  let ariaChecked: boolean | 'mixed' | undefined;
  if (selection === SelectionTypes.MULTIPLE) {
    ariaChecked = indeterminate ? 'mixed' : checked;
  }

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.checked);
    },
    [onChange],
  );

  const dataRowSelect = useMemo(() => (rowSelect ? 'true' : undefined), [rowSelect]);

  return {
    ariaChecked,
    dataRowSelect,
    handleChange,
    inputRef,
  };
};

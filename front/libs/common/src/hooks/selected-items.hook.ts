import { useCallback, useState } from 'react';

export interface SelectedItemsHook<T> {
  defaultValues?: T[];
  multiple?: boolean;
}

export const useSelectedItems = <T>(options?: SelectedItemsHook<T>) => {
  const { defaultValues = [], multiple = false } = options || {};

  const [selected, setSelected] = useState<T[]>(defaultValues);

  const onItemSelect = useCallback(
    (id: T) => {
      let next = [...selected];
      const isIncluded = next.includes(id);

      if (multiple) {
        next = isIncluded ? next.filter((uid) => uid !== id) : [...next, id];
      } else {
        next = isIncluded ? [] : [id];
      }
      setSelected(next);
    },
    [selected, multiple],
  );

  return { onItemSelect, selected };
};

import { useCallback, useMemo, useState } from 'react';

import type { SelectableInterface } from '../../interfaces';

export type UseSelectableOptions<T> = {
  items: T[];
  getItemId: (item: T) => string;
  initialSelection?: Set<string> | (() => Set<string>);
};

export const useSelectable = <T>({
  getItemId,
  initialSelection,
  items,
}: UseSelectableOptions<T>): SelectableInterface<T> => {
  const allIds = useMemo(() => items.map(getItemId), [getItemId, items]);

  const [selection, setSelection] = useState<Set<string>>(() => {
    if (typeof initialSelection === 'function') {
      return initialSelection();
    }

    return initialSelection ?? new Set<string>();
  });

  const isAllItemsSelected = allIds.length > 0 && allIds.every((id) => selection.has(id));

  const checkIfItemIsSelected = useCallback(
    (item: T) => selection.has(getItemId(item)),
    [getItemId, selection],
  );

  const toggleOneItem = useCallback(
    (item: T, checked: boolean) => {
      const id = getItemId(item);

      setSelection((prev) => {
        const next = new Set(prev);

        if (checked) {
          next.add(id);
        } else {
          next.delete(id);
        }

        return next;
      });
    },
    [getItemId],
  );

  const toggleAllItems = useCallback(
    (checked: boolean) => {
      setSelection(checked ? new Set(allIds) : new Set());
    },
    [allIds],
  );

  return {
    checkIfItemIsSelected,
    isAllItemsSelected,
    selection,
    toggleAllItems,
    toggleOneItem,
  };
};

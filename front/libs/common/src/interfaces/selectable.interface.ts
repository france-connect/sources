export interface SelectableInterface<T> {
  checkIfItemIsSelected: (item: T) => boolean;
  isAllItemsSelected: boolean;
  selection: Set<string>;
  toggleAllItems: (checked: boolean) => void;
  toggleOneItem: (item: T, checked: boolean) => void;
}

import { act, renderHook } from '@testing-library/react';

import { useSelectable } from './selectable.hook';

type TestItem = {
  id: string;
  name: string;
};

describe('useSelectable', () => {
  // Given
  const item1: TestItem = { id: 'item-1', name: 'Item 1' };
  const item2: TestItem = { id: 'item-2', name: 'Item 2' };
  const items = [item1, item2];
  const getItemId = (item: TestItem) => item.id;

  it('should return empty selection by default', () => {
    // When
    const { result } = renderHook(() =>
      useSelectable({
        getItemId,
        items,
      }),
    );

    // Then
    expect(result.current.selection).toStrictEqual(new Set());
    expect(result.current.isAllItemsSelected).toBeFalse();
    expect(result.current.checkIfItemIsSelected(item1)).toBeFalse();
    expect(result.current.checkIfItemIsSelected(item2)).toBeFalse();
  });

  it('should return isAllItemsSelected false when items list is empty', () => {
    // When
    const { result } = renderHook(() =>
      useSelectable({
        getItemId,
        items: [],
      }),
    );

    // Then
    expect(result.current.isAllItemsSelected).toBeFalse();
  });

  describe('initialSelection', () => {
    it('should initialize selection from a Set', () => {
      // When
      const { result } = renderHook(() =>
        useSelectable({
          getItemId,
          initialSelection: new Set(['item-1']),
          items,
        }),
      );

      // Then
      expect(result.current.checkIfItemIsSelected(item1)).toBeTrue();
      expect(result.current.checkIfItemIsSelected(item2)).toBeFalse();
      expect(result.current.selection).toStrictEqual(new Set(['item-1']));
      expect(result.current.isAllItemsSelected).toBeFalse();
    });

    it('should initialize selection from a factory', () => {
      // When
      const { result } = renderHook(() =>
        useSelectable({
          getItemId,
          initialSelection: () => new Set(['item-1', 'item-2']),
          items,
        }),
      );

      // Then
      expect(result.current.isAllItemsSelected).toBeTrue();
      expect(result.current.selection).toStrictEqual(new Set(['item-1', 'item-2']));
    });
  });

  describe('toggleOneItem', () => {
    it('should select an unselected item', () => {
      // When
      const { result } = renderHook(() =>
        useSelectable({
          getItemId,
          items,
        }),
      );

      act(() => {
        result.current.toggleOneItem(item1, true);
      });

      // Then
      expect(result.current.checkIfItemIsSelected(item1)).toBeTrue();
      expect(result.current.checkIfItemIsSelected(item2)).toBeFalse();
      expect(result.current.selection).toStrictEqual(new Set(['item-1']));
      expect(result.current.isAllItemsSelected).toBeFalse();
    });

    it('should deselect a selected item', () => {
      // When
      const { result } = renderHook(() =>
        useSelectable({
          getItemId,
          items,
        }),
      );

      act(() => {
        result.current.toggleOneItem(item1, true);
      });
      act(() => {
        result.current.toggleOneItem(item1, false);
      });

      // Then
      expect(result.current.checkIfItemIsSelected(item1)).toBeFalse();
      expect(result.current.selection).toStrictEqual(new Set());
    });
  });

  describe('toggleAllItems', () => {
    it('should select all items', () => {
      // When
      const { result } = renderHook(() =>
        useSelectable({
          getItemId,
          items,
        }),
      );

      act(() => {
        result.current.toggleAllItems(true);
      });

      // Then
      expect(result.current.isAllItemsSelected).toBeTrue();
      expect(result.current.checkIfItemIsSelected(item1)).toBeTrue();
      expect(result.current.checkIfItemIsSelected(item2)).toBeTrue();
      expect(result.current.selection).toStrictEqual(new Set(['item-1', 'item-2']));
    });

    it('should deselect all items', () => {
      // When
      const { result } = renderHook(() =>
        useSelectable({
          getItemId,
          items,
        }),
      );

      act(() => {
        result.current.toggleAllItems(true);
      });
      act(() => {
        result.current.toggleAllItems(false);
      });

      // Then
      expect(result.current.isAllItemsSelected).toBeFalse();
      expect(result.current.checkIfItemIsSelected(item1)).toBeFalse();
      expect(result.current.checkIfItemIsSelected(item2)).toBeFalse();
      expect(result.current.selection).toStrictEqual(new Set());
    });
  });
});

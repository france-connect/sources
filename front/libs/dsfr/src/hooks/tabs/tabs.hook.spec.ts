import { act, renderHook } from '@testing-library/react';

import { TabDirection, useTabs } from './tabs.hook';

describe('useTabs', () => {
  it('should return selectedIndex as 0 by default', () => {
    // When
    const { result } = renderHook(() => useTabs());

    // Then
    expect(result.current.selectedIndex).toBe(0);
  });

  it('should return selectedIndex as initialIndex when provided', () => {
    // Given
    const initialIndex = 2;

    // When
    const { result } = renderHook(() => useTabs(initialIndex));

    // Then
    expect(result.current.selectedIndex).toBe(2);
  });

  it('should update selectedIndex when selectTab is called', () => {
    // Given
    const { result } = renderHook(() => useTabs());

    // When
    act(() => {
      result.current.selectTab(1);
    });

    // Then
    expect(result.current.selectedIndex).toBe(1);
  });

  it('should return selectTab function', () => {
    // When
    const { result } = renderHook(() => useTabs());

    // Then
    expect(result.current.selectTab).toBeInstanceOf(Function);
  });

  it('should return getDirection function', () => {
    // When
    const { result } = renderHook(() => useTabs());

    // Then
    expect(result.current.getDirection).toBeInstanceOf(Function);
  });

  it('should return null direction for selected panel', () => {
    // Given
    const { result } = renderHook(() => useTabs(1));

    // When
    const direction = result.current.getDirection(1);

    // Then
    expect(direction).toBeNull();
  });

  it('should return start direction for panel before selected', () => {
    // Given
    const { result } = renderHook(() => useTabs(2));

    // When
    const direction = result.current.getDirection(0);

    // Then
    expect(direction).toBe(TabDirection.START);
  });

  it('should return end direction for panel after selected', () => {
    // Given
    const { result } = renderHook(() => useTabs(0));

    // When
    const direction = result.current.getDirection(2);

    // Then
    expect(direction).toBe(TabDirection.END);
  });

  it('should return tabsRef', () => {
    // When
    const { result } = renderHook(() => useTabs());

    // Then
    expect(result.current.tabsRef).toEqual({ current: null });
  });

  it('should return tabsStyle as empty object initially', () => {
    // When
    const { result } = renderHook(() => useTabs());

    // Then
    expect(result.current.tabsStyle).toEqual({});
  });

  it('should set tabsStyle with tabs-height when elements are found', () => {
    // Given
    const mockList = { clientHeight: 50 } as HTMLElement;
    const mockPanel = { clientHeight: 200 } as HTMLElement;
    const mockQuerySelector = jest
      .fn()
      .mockReturnValueOnce(mockList)
      .mockReturnValueOnce(mockPanel);
    const mockDiv = {
      querySelector: mockQuerySelector,
    } as unknown as HTMLDivElement;

    // When
    const { result } = renderHook(() => useTabs());
    result.current.tabsRef.current = mockDiv;
    act(() => {
      result.current.selectTab(1);
    });

    // Then
    expect(result.current.tabsStyle).toHaveProperty('--tabs-height', '250px');
    expect(mockQuerySelector).toHaveBeenCalledWith('.fr-tabs__list');
    expect(mockQuerySelector).toHaveBeenCalledWith('.fr-tabs__panel--selected');
  });
});

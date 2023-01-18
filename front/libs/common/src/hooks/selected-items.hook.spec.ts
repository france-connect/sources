import { act, renderHook } from '@testing-library/react';
import React from 'react';

import { useSelectedItems } from './selected-items.hook';

describe('useSelectedItems', () => {
  it('should return default value', () => {
    // when
    const { result } = renderHook(() => useSelectedItems());

    // then
    expect(result.current).toStrictEqual({
      onItemSelect: expect.any(Function),
      selected: [],
    });
  });

  it('should return value from param', () => {
    // when
    const { result } = renderHook((options) => useSelectedItems(options), {
      initialProps: {
        defaultValues: ['id-mock-1'],
        multiple: true,
      },
    });

    // then
    expect(result.current).toStrictEqual({
      onItemSelect: expect.any(Function),
      selected: ['id-mock-1'],
    });
  });

  it('should add given mock id to selected array when multiple is true', () => {
    // given
    const mockId = 'mock-id-1';
    const setSelectedMock = jest.fn();
    const selectedMock = ['mock-id-2', 'mock-id-3'];
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [selectedMock, setSelectedMock]);

    // when
    const { result } = renderHook((options) => useSelectedItems(options), {
      initialProps: {
        defaultValues: selectedMock,
        multiple: true,
      },
    });
    act(() => {
      result.current.onItemSelect(mockId);
    });

    // then
    expect(setSelectedMock).toHaveBeenCalledWith(['mock-id-2', 'mock-id-3', 'mock-id-1']);
  });

  it('should remove given mock id to selected array when multiple is true and mock id already exists', () => {
    // given
    const mockId = 'mock-id-1';
    const setSelectedMock = jest.fn();
    const selectedMock = ['mock-id-2', 'mock-id-3', 'mock-id-1'];
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [selectedMock, setSelectedMock]);

    // when
    const { result } = renderHook((options) => useSelectedItems(options), {
      initialProps: {
        defaultValues: selectedMock,
        multiple: true,
      },
    });
    act(() => {
      result.current.onItemSelect(mockId);
    });

    // then
    expect(setSelectedMock).toHaveBeenCalledWith(['mock-id-2', 'mock-id-3']);
  });

  it('should only have mock-id-1 into selected array when multiple is false', () => {
    // given
    const mockId = 'mock-id-1';
    const setSelectedMock = jest.fn();
    const selectedMock = ['mock-id-2', 'mock-id-3'];
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [selectedMock, setSelectedMock]);

    // when
    const { result } = renderHook((options) => useSelectedItems(options), {
      initialProps: {
        defaultValues: selectedMock,
        multiple: false,
      },
    });
    act(() => {
      result.current.onItemSelect(mockId);
    });

    // then
    expect(setSelectedMock).toHaveBeenCalledWith(['mock-id-1']);
  });

  it('should toggle mock-id-1 into selected array when multiple is false and it already exists', () => {
    // given
    const mockId = 'mock-id-1';
    const setSelectedMock = jest.fn();
    const selectedMock = ['mock-id-1'];
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [selectedMock, setSelectedMock]);

    // when
    const { result } = renderHook((options) => useSelectedItems(options), {
      initialProps: {
        defaultValues: selectedMock,
        multiple: false,
      },
    });
    act(() => {
      result.current.onItemSelect(mockId);
    });

    // then
    expect(setSelectedMock).toHaveBeenCalledWith([]);
  });
});

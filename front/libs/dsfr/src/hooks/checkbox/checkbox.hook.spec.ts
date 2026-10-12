import { act, renderHook } from '@testing-library/react';

import { SelectionTypes } from '../../enums';
import { useCheckbox } from './checkbox.hook';

describe('useCheckbox', () => {
  // Given
  const onChangeMock = jest.fn();

  it('should return an input ref', () => {
    // When
    const { result } = renderHook(() =>
      useCheckbox({
        checked: false,
        onChange: onChangeMock,
        rowSelect: false,
      }),
    );

    // Then
    expect(result.current.inputRef).toEqual({ current: null });
  });

  it('should return ariaChecked undefined for single selection', () => {
    // When
    const { result } = renderHook(() =>
      useCheckbox({
        checked: true,
        onChange: onChangeMock,
        rowSelect: false,
        selection: SelectionTypes.SINGLE,
      }),
    );

    // Then
    expect(result.current.ariaChecked).toBeUndefined();
  });

  it('should return ariaChecked for multiple selection when checked', () => {
    // When
    const { result } = renderHook(() =>
      useCheckbox({
        checked: true,
        onChange: onChangeMock,
        rowSelect: false,
        selection: SelectionTypes.MULTIPLE,
      }),
    );

    // Then
    expect(result.current.ariaChecked).toBeTrue();
  });

  it('should return ariaChecked false for multiple selection when unchecked', () => {
    // When
    const { result } = renderHook(() =>
      useCheckbox({
        checked: false,
        onChange: onChangeMock,
        rowSelect: false,
        selection: SelectionTypes.MULTIPLE,
      }),
    );

    // Then
    expect(result.current.ariaChecked).toBeFalse();
  });

  it('should return ariaChecked mixed when indeterminate', () => {
    // When
    const { result } = renderHook(() =>
      useCheckbox({
        checked: false,
        indeterminate: true,
        onChange: onChangeMock,
        rowSelect: false,
        selection: SelectionTypes.MULTIPLE,
      }),
    );

    // Then
    expect(result.current.ariaChecked).toBe('mixed');
  });

  it('should return no selection attributes when selection is undefined', () => {
    // When
    const { result } = renderHook(() =>
      useCheckbox({
        checked: false,
        onChange: onChangeMock,
        rowSelect: false,
      }),
    );

    // Then
    expect(result.current.ariaChecked).toBeUndefined();
  });

  it('should call onChange with checked value', () => {
    // When
    const { result } = renderHook(() =>
      useCheckbox({
        checked: false,
        onChange: onChangeMock,
        rowSelect: false,
      }),
    );

    act(() => {
      result.current.handleChange({
        target: { checked: true },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    // Then
    expect(onChangeMock).toHaveBeenCalledExactlyOnceWith(true);
  });

  it('should not set indeterminate when input ref is not attached', () => {
    // When
    const { result } = renderHook(() =>
      useCheckbox({
        checked: false,
        indeterminate: true,
        onChange: onChangeMock,
        rowSelect: false,
      }),
    );

    // Then
    expect(result.current.inputRef.current).toBeNull();
  });

  it('should set input indeterminate property on the input ref', () => {
    // Given
    const inputElement = document.createElement('input');

    const { rerender, result } = renderHook(
      ({ checked, indeterminate }) =>
        useCheckbox({
          checked,
          indeterminate,
          onChange: onChangeMock,
          rowSelect: false,
          selection: SelectionTypes.MULTIPLE,
        }),
      { initialProps: { checked: false, indeterminate: false } },
    );

    act(() => {
      result.current.inputRef.current = inputElement;
    });

    // When
    rerender({ checked: false, indeterminate: true });

    // Then
    expect(inputElement.indeterminate).toBeTrue();

    // When
    rerender({ checked: true, indeterminate: false });

    // Then
    expect(inputElement.indeterminate).toBeFalse();
  });

  it('should return dataRowSelect undefined when rowSelect is false', () => {
    // When
    const { result } = renderHook(() =>
      useCheckbox({
        checked: false,
        onChange: onChangeMock,
        rowSelect: false,
      }),
    );

    // Then
    expect(result.current.dataRowSelect).toBeUndefined();
  });

  it('should return dataRowSelect true when rowSelect is true', () => {
    // When
    const { result } = renderHook(() =>
      useCheckbox({
        checked: false,
        onChange: onChangeMock,
        rowSelect: true,
      }),
    );

    // Then
    expect(result.current.dataRowSelect).toBe('true');
  });
});

import { renderHook } from '@testing-library/react';

import type { InstanceInterface } from '../../interfaces';
import { useDeleteInstanceButton } from './delete-instance-button.hook';

describe('useDeleteInstanceButton', () => {
  // Given
  const instanceMock = { id: 'any-instance-id-mock' } as InstanceInterface;
  const onDeleteMock = jest.fn();

  const renderUseDeleteInstanceButton = () =>
    renderHook(() => useDeleteInstanceButton({ instance: instanceMock, onDelete: onDeleteMock }));

  it('should return the deletion handler', () => {
    // When
    const { result } = renderUseDeleteInstanceButton();

    // Then
    expect(result.current).toStrictEqual({
      handleDelete: expect.any(Function),
    });
  });

  it('should call onDelete with the instance', () => {
    // Given
    const { result } = renderUseDeleteInstanceButton();

    // When
    result.current.handleDelete();

    // Then
    expect(onDeleteMock).toHaveBeenCalledExactlyOnceWith(instanceMock);
  });
});

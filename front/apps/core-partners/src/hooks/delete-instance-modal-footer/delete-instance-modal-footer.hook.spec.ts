import { act, renderHook } from '@testing-library/react';

import { useDeleteInstanceModalFooter } from './delete-instance-modal-footer.hook';

describe('useDeleteInstanceModalFooter', () => {
  // Given
  const onCloseMock = jest.fn();
  const onConfirmMock = jest.fn();

  const renderUseDeleteInstanceModalFooter = () =>
    renderHook(() =>
      useDeleteInstanceModalFooter({ onClose: onCloseMock, onConfirm: onConfirmMock }),
    );

  it('should return the confirmation handler', () => {
    // When
    const { result } = renderUseDeleteInstanceModalFooter();

    // Then
    expect(result.current).toStrictEqual({
      handleConfirm: expect.any(Function),
    });
  });

  it('should call onConfirm then close the modal', async () => {
    // Given
    onConfirmMock.mockResolvedValueOnce(undefined);
    const { result } = renderUseDeleteInstanceModalFooter();

    // When
    await act(async () => {
      await result.current.handleConfirm();
    });

    // Then
    expect(onConfirmMock).toHaveBeenCalledExactlyOnceWith();
    expect(onCloseMock).toHaveBeenCalledOnce();
  });
});

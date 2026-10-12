import { act, renderHook } from '@testing-library/react';

import { useModalFooter } from './use-modal-footer.hook';

describe('useModalFooter', () => {
  // Given
  const onCloseMock = jest.fn();
  const onConfirmMock = jest.fn();

  const renderUseModalFooter = () =>
    renderHook(() => useModalFooter({ onClose: onCloseMock, onConfirm: onConfirmMock }));

  it('should return the confirmation handler', () => {
    // When
    const { result } = renderUseModalFooter();

    // Then
    expect(result.current).toStrictEqual({
      handleConfirm: expect.any(Function),
    });
  });

  it('should call onConfirm then close the modal', async () => {
    // Given
    onConfirmMock.mockResolvedValueOnce(undefined);
    const { result } = renderUseModalFooter();

    // When
    await act(async () => {
      await result.current.handleConfirm();
    });

    // Then
    expect(onConfirmMock).toHaveBeenCalledExactlyOnceWith();
    expect(onCloseMock).toHaveBeenCalledOnce();
  });
});

import { renderHook } from '@testing-library/react';

import { useSafeContext } from '@fc/common';

import { ModalContext } from '../../context/modal.context';
import { useModal } from './use-modal.hook';

describe('useModal', () => {
  it('should call useSafeContext with ModalContext', () => {
    // Given
    const contextValueMock = {
      closeModal: jest.fn(),
      currentModal: null,
      openModal: jest.fn(),
    };
    jest.mocked(useSafeContext).mockReturnValueOnce(contextValueMock);

    // When
    const { result } = renderHook(() => useModal());

    // Then
    expect(useSafeContext).toHaveBeenCalledOnce();
    expect(useSafeContext).toHaveBeenCalledWith(ModalContext);
    expect(result.current).toBe(contextValueMock);
  });
});

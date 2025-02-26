import { renderHook } from '@testing-library/react';
import type { ClipboardEvent } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';

import { useClipboard } from './clipboard.hook';

describe('useClipboard', () => {
  // Given
  const clipboardValueMock = 'clipboard-value-mock';
  const clipboardEventMock = {
    clipboardData: {
      getData: jest.fn(() => clipboardValueMock),
    },
    preventDefault: jest.fn(),
  } as unknown as ClipboardEvent<Element>;

  it('should call useCopyToClipboard hook', () => {
    // When
    renderHook(() => useClipboard());

    // Then
    expect(useCopyToClipboard).toHaveBeenCalled();
  });

  it('should call copy when onCopy is called', () => {
    // Given
    const copyMock = jest.fn();
    jest.mocked(useCopyToClipboard).mockReturnValue([null, copyMock]);

    // When
    renderHook(() => {
      const { onCopy } = useClipboard();
      onCopy(clipboardValueMock);
    });

    // Then
    expect(copyMock).toHaveBeenCalledWith(clipboardValueMock);
  });

  it('should call clipboardData.getData from useCopyToClipboard hook when calling onPaste', () => {
    // Given
    let result = null;

    // When
    renderHook(() => {
      const { onPaste } = useClipboard();
      result = onPaste(clipboardEventMock);
    });

    // Then
    expect(clipboardEventMock.preventDefault).toHaveBeenCalled();
    expect(clipboardEventMock.clipboardData.getData).toHaveBeenCalledWith('text');
    expect(result).toBeFalse();
  });
});

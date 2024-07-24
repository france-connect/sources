import { renderHook } from '@testing-library/react';
import type { ClipboardEvent } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';

import { useClipboard } from './clipboard.hook';

describe('useClipboard', () => {
  // given
  const clipboardValueMock = 'clipboard-value-mock';
  const clipboardEventMock = {
    clipboardData: {
      getData: jest.fn(() => clipboardValueMock),
    },
    preventDefault: jest.fn(),
  } as unknown as ClipboardEvent<Element>;

  it('should call useCopyToClipboard hook', () => {
    // when
    renderHook(() => useClipboard(true));

    // then
    expect(useCopyToClipboard).toHaveBeenCalled();
  });

  it('should call copy when onCopy is called', () => {
    // given
    const copyMock = jest.fn();
    jest.mocked(useCopyToClipboard).mockReturnValue([null, copyMock]);

    // when
    renderHook(() => {
      const { onCopy } = useClipboard(true);
      onCopy(clipboardValueMock);
    });

    // then
    expect(copyMock).toHaveBeenCalledWith(clipboardValueMock);
  });

  it('should return true when user is not allowed to paste', () => {
    // given
    let result = null;

    // when
    renderHook(() => {
      const { onPaste } = useClipboard(false);
      result = onPaste(clipboardEventMock);
    });

    // then
    expect(result).toBeTrue();
  });

  it('should call clipboardData.getData from useCopyToClipboard hook when calling onPaste', () => {
    // given
    let result = null;

    // when
    renderHook(() => {
      const { onPaste } = useClipboard(true);
      result = onPaste(clipboardEventMock);
    });

    // then
    expect(clipboardEventMock.preventDefault).toHaveBeenCalled();
    expect(clipboardEventMock.clipboardData.getData).toHaveBeenCalledWith('text');
    expect(result).toBeFalse();
  });
});

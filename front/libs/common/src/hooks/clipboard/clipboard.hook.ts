import type { ClipboardEvent } from 'react';
import { useCallback } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';

const CLIPBOARD_DATA_FORMAT = 'text';

export const useClipboard = () => {
  const [value, copy] = useCopyToClipboard();

  const onCopy = useCallback(
    (text: string) => {
      const copied = copy(text);
      return copied;
    },
    [copy],
  );

  const onPaste = useCallback((event: ClipboardEvent) => {
    event.preventDefault();
    event.clipboardData.getData(CLIPBOARD_DATA_FORMAT);
    return false;
  }, []);

  return { onCopy, onPaste, value };
};

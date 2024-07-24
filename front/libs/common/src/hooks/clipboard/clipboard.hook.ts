import type { ClipboardEvent } from 'react';
import { useCallback } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';

const CLIPBOARD_DATA_FORMAT = 'text';

export const useClipboard = (canPaste: boolean) => {
  const [value, copy] = useCopyToClipboard();

  const onCopy = useCallback((text: string) => copy(text), [copy]);

  const onPaste = useCallback(
    (event: ClipboardEvent) => {
      if (!canPaste) {
        return true;
      }

      event.preventDefault();
      event.clipboardData.getData(CLIPBOARD_DATA_FORMAT);
      return false;
    },
    [canPaste],
  );

  return { onCopy, onPaste, value };
};

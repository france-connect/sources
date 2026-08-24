import type { SyntheticEvent } from 'react';
import { useCallback, useEffect, useRef } from 'react';

interface UseModalShellProps {
  id: string;
  onClose: () => void;
  titleId?: string;
}

export const useModalShell = ({ id, onClose, titleId }: UseModalShellProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const onCloseRef = useRef(onClose);

  const resolvedTitleId = titleId ?? `${id}-title`;

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const handleCancel = useCallback((event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    onCloseRef.current();
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return undefined;
    }

    const handleBackdropClick = (event: MouseEvent) => {
      if (event.target === dialog) {
        onCloseRef.current();
      }
    };

    dialog.addEventListener('click', handleBackdropClick);
    return () => {
      dialog.removeEventListener('click', handleBackdropClick);
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return undefined;
    }

    if (!dialog.open) {
      dialog.showModal();
    }

    return () => {
      if (dialog.open) {
        dialog.close();
      }
    };
  }, []);

  return {
    dialogRef,
    handleCancel,
    resolvedTitleId,
  };
};

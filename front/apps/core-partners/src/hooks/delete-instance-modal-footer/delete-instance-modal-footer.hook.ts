import { useCallback } from 'react';

interface UseDeleteInstanceModalFooterProps {
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
}

export const useDeleteInstanceModalFooter = ({
  onClose,
  onConfirm,
}: UseDeleteInstanceModalFooterProps) => {
  const handleConfirm = useCallback(async () => {
    await onConfirm();
    onClose();
  }, [onClose, onConfirm]);

  return { handleConfirm };
};

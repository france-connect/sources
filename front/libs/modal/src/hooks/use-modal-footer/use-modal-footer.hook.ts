import { useCallback } from 'react';

interface UseModalFooterProps {
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
}

export const useModalFooter = ({ onClose, onConfirm }: UseModalFooterProps) => {
  const handleConfirm = useCallback(async () => {
    await onConfirm();
    onClose();
  }, [onClose, onConfirm]);

  return { handleConfirm };
};

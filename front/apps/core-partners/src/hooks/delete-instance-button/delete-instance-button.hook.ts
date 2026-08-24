import { useCallback } from 'react';

import type { InstanceInterface } from '../../interfaces';

interface UseDeleteInstanceButtonProps {
  instance: InstanceInterface;
  onDelete: (instance: InstanceInterface) => void;
}

export const useDeleteInstanceButton = ({ instance, onDelete }: UseDeleteInstanceButtonProps) => {
  const handleDelete = useCallback(() => {
    onDelete(instance);
  }, [instance, onDelete]);

  return { handleDelete };
};

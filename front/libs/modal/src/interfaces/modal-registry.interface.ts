import type { ComponentType } from 'react';

export interface ModalContentProps {
  id: string;
  onClose: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ModalRegistryInterface = Record<string, ComponentType<any>>;

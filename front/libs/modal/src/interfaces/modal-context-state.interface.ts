import type { ModalEntryInterface } from './modal-entry.interface';

export interface ModalContextStateInterface {
  closeModal: () => void;
  currentModal: ModalEntryInterface | null;
  openModal: <TProps extends Record<string, unknown>>(id: string, props: TProps) => void;
}

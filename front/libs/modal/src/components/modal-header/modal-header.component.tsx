import React from 'react';

import { ModalCloseButtonComponent } from '../modal-close-button';

interface ModalHeaderComponentProps {
  id: string;
  onClose: () => void;
}

export const ModalHeaderComponent = React.memo(({ id, onClose }: ModalHeaderComponentProps) => (
  <div className="fr-modal__header">
    <ModalCloseButtonComponent id={id} onClose={onClose} />
  </div>
));

ModalHeaderComponent.displayName = 'ModalHeaderComponent';

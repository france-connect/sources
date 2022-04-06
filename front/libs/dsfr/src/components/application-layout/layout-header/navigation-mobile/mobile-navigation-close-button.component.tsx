import React, { MouseEventHandler } from 'react';
import { RiCloseLine as CloseIcon } from 'react-icons/ri';

interface MobileNavigationCloseButtonComponentProps {
  onClose: MouseEventHandler<HTMLButtonElement>;
}

export const MobileNavigationCloseButtonComponent: React.FC<MobileNavigationCloseButtonComponentProps> =
  React.memo(({ onClose }: MobileNavigationCloseButtonComponentProps) => (
    <button
      className="w100 flex-columns flex-end items-center pr16 is-blue-france fs14 lh24"
      onClick={onClose}>
      <span>Fermer</span>
      <CloseIcon className="ml12" />
    </button>
  ));

MobileNavigationCloseButtonComponent.displayName = 'MobileNavigationCloseButtonComponent';

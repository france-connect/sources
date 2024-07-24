import type { MouseEventHandler } from 'react';
import React from 'react';

interface LayoutHeaderMobileBurgerButtonProps {
  onOpen: MouseEventHandler<HTMLButtonElement>;
  opened: boolean;
}

export const LayoutHeaderMobileBurgerButton: React.FC<LayoutHeaderMobileBurgerButtonProps> =
  React.memo(({ onOpen, opened }: LayoutHeaderMobileBurgerButtonProps) => (
    <div className="fr-header__navbar">
      <button
        aria-controls="layout-header-menu-modal"
        aria-haspopup="menu"
        className="fr-btn--menu fr-btn"
        data-fr-opened={opened}
        id="burger-button-mobile-menu"
        title="Menu"
        onClick={onOpen}>
        Menu
      </button>
    </div>
  ));

LayoutHeaderMobileBurgerButton.displayName = 'LayoutHeaderMobileBurgerButton';

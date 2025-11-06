import React from 'react';

import { useSafeContext } from '@fc/common';
import { t } from '@fc/i18n';

import { LayoutContext } from '../../../context';
import type { LayoutContextState } from '../../../interfaces';

export const LayoutHeaderMobileBurgerButton = React.memo(() => {
  const { menuIsOpened, toggleMenu } = useSafeContext<LayoutContextState>(LayoutContext);

  const menuLabel = t('Layout.menu.label');
  return (
    <div className="fr-header__navbar">
      <button
        aria-controls="layout-header-menu-modal"
        aria-haspopup="menu"
        className="fr-btn--menu fr-btn"
        data-fr-opened={menuIsOpened}
        data-testid="burger-button-mobile-menu"
        id="burger-button-mobile-menu"
        title={menuLabel}
        onClick={toggleMenu}>
        {menuLabel}
      </button>
    </div>
  );
});

LayoutHeaderMobileBurgerButton.displayName = 'LayoutHeaderMobileBurgerButton';

import classnames from 'classnames';
import React from 'react';

import { type NavigationLinkInterface, useSafeContext } from '@fc/common';
import { t } from '@fc/i18n';

import { LayoutContext } from '../../../context';
import type { LayoutContextState } from '../../../interfaces';
import { LayoutHeaderNavigationComponent } from '../navigation';
import { LayoutHeaderToolsComponent } from '../tools';

interface LayoutHeaderMenuComponentProps {
  navigation?: NavigationLinkInterface[];
}

export const LayoutHeaderMenuComponent = React.memo(
  ({ navigation }: LayoutHeaderMenuComponentProps) => {
    const { menuIsOpened, toggleMenu } = useSafeContext<LayoutContextState>(LayoutContext);

    return (
      <div
        aria-labelledby="burger-button-mobile-menu"
        className={classnames('fr-header__menu fr-modal no-touch-action', {
          // @NOTE unable to create a eslint rule to match this case
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'fr-modal--opened': menuIsOpened,
        })}
        id="layout-header-menu-modal">
        <div className="fr-container">
          <button
            aria-controls="layout-header-menu-modal"
            className="fr-btn--close fr-btn"
            onClick={toggleMenu}>
            {t('FC.Common.close')}
          </button>
          <div className="fr-header__menu-links">
            <LayoutHeaderToolsComponent />
          </div>
          {navigation?.length && (
            <LayoutHeaderNavigationComponent navigation={navigation} onItemClick={toggleMenu} />
          )}
        </div>
      </div>
    );
  },
);

LayoutHeaderMenuComponent.displayName = 'LayoutHeaderMenuComponent';

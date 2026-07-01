import classnames from 'classnames';
import React from 'react';

import { useSafeContext } from '@fc/common';
import { ConfigService } from '@fc/config';

import { LayoutContext } from '../../context';
import { LayoutOptions } from '../../enums';
import type { LayoutConfig, LayoutContextState } from '../../interfaces';
import { LayoutHeaderBrandComponent } from './brand';
import styles from './layout-header.module.scss';
import { LayoutHeaderMenuComponent } from './menu';
import { LayoutHeaderToolsComponent } from './tools';

export const LayoutHeaderComponent = React.memo(() => {
  const { isUserConnected } = useSafeContext<LayoutContextState>(LayoutContext);

  const { header } = ConfigService.get<LayoutConfig>(LayoutOptions.CONFIG_NAME);
  const { navigation } = header ?? {};

  return (
    <header className={classnames(styles.banner, 'fr-header')} role="banner">
      <div className="fr-header__body">
        <div className="fr-container">
          <div className="fr-header__body-row">
            <LayoutHeaderBrandComponent />
            <div className="fr-header__tools">
              <div className="fr-header__tools-links">
                <LayoutHeaderToolsComponent isUserConnected={isUserConnected} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <LayoutHeaderMenuComponent isUserConnected={isUserConnected} navigation={navigation} />
    </header>
  );
});

LayoutHeaderComponent.displayName = 'LayoutHeaderComponent';

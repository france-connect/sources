import classnames from 'classnames';
import React from 'react';

import { useSafeContext } from '@fc/common';
import { ConfigService } from '@fc/config';

import { LayoutContext } from '../../context';
import { Options } from '../../enums';
import type { LayoutConfig, LayoutContextState } from '../../interfaces';
import { LayoutHeaderBrandComponent } from './brand';
import styles from './layout-header.module.scss';
import { LayoutHeaderMenuComponent } from './menu';
import { LayoutHeaderToolsComponent } from './tools';

export const LayoutHeaderComponent = React.memo(() => {
  const { isUserConnected } = useSafeContext<LayoutContextState>(LayoutContext);

  const config = ConfigService.get<LayoutConfig>(Options.CONFIG_NAME);
  const { navigation } = config;

  return (
    <header className={classnames(styles.banner, 'fr-header')} role="banner">
      <div className="fr-header__body">
        <div className="fr-container">
          <div className="fr-header__body-row">
            <LayoutHeaderBrandComponent />
            <div className="fr-header__tools">
              <div className="fr-header__tools-links">
                {isUserConnected && <LayoutHeaderToolsComponent />}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isUserConnected && <LayoutHeaderMenuComponent navigation={navigation} />}
    </header>
  );
});

LayoutHeaderComponent.displayName = 'LayoutHeaderComponent';

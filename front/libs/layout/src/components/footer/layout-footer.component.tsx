import React from 'react';

import { ConfigService } from '@fc/config';

import { LayoutOptions } from '../../enums';
import type { LayoutConfig } from '../../interfaces';
import { LayoutFooterBottomComponent } from './bottom';
import { LayoutFooterBrandComponent } from './brand';
import { LayoutFooterContentComponent } from './content';

export const LayoutFooterComponent = React.memo(() => {
  const config = ConfigService.get<LayoutConfig>(LayoutOptions.CONFIG_NAME);
  const { navigation } = config.footer;
  const { showLicence } = config.features;

  const showFooterBottom = navigation || showLicence;
  return (
    <footer className="sticky-footer fr-footer" id="footer" role="contentinfo">
      <div className="fr-container">
        <div className="fr-footer__body">
          <LayoutFooterBrandComponent />
          <LayoutFooterContentComponent />
        </div>
        {showFooterBottom && <LayoutFooterBottomComponent />}
      </div>
    </footer>
  );
});

LayoutFooterComponent.displayName = 'LayoutFooterComponent';

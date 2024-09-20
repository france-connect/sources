import { getAccessibleTitle } from '@fc/common';
import { ConfigService } from '@fc/config';

import { Options } from '../../../enums';
import type { LayoutConfig } from '../../../interfaces';

export const LayoutHeaderServiceComponent = () => {
  const config = ConfigService.get<LayoutConfig>(Options.CONFIG_NAME);
  const { baseline, homepage, name } = config.service;

  const linkTitle = getAccessibleTitle('Retour à l’accueil du site', baseline, name);
  return (
    <div className="fr-header__service" data-testid="layout-header-service-component">
      {name && (
        <a data-testid="layout-header-service-component-name" href={homepage} title={linkTitle}>
          <p className="fr-header__service-title">{name}</p>
        </a>
      )}
      {baseline && (
        <p
          className="fr-header__service-tagline"
          data-testid="layout-header-service-component-baseline">
          {baseline}
        </p>
      )}
    </div>
  );
};

LayoutHeaderServiceComponent.displayName = 'LayoutHeaderServiceComponent';

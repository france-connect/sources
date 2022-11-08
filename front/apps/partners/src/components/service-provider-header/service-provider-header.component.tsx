import React from 'react';
import { Link } from 'react-router-dom';

import { BadgeComponent, Sizes } from '@fc/dsfr';
import { t } from '@fc/i18n';

interface ServiceProviderHeaderComponentProps {
  item: {
    color: string;
    platformName: string;
    status: string;
    spName: string;
  };
}

export const ServiceProviderHeaderComponent = React.memo(
  ({ item }: ServiceProviderHeaderComponentProps) => {
    const { color, platformName, spName, status } = item;
    return (
      <React.Fragment>
        <div className="fr-mb-2w">
          <Link
            className="fr-btn fr-btn--tertiary-no-outline fr-fi-arrow-go-back-fill fr-btn--icon-left"
            data-testid="ServiceProviderHeaderComponent-return-sp-list-button"
            to="/service-providers">
            {t('ServiceProvidersDetailsPage.returnButton')}
          </Link>
        </div>
        {/* @TODO: add classname to BadgeComponent to match with designs spacing */}
        <BadgeComponent
          noIcon
          colorName={color}
          dataTestId="ServiceProviderHeaderComponent-badge"
          label={status}
          size={Sizes.MEDIUM}
        />
        <span className="fr-ml-2w" data-testid="ServiceProviderHeaderComponent-platform">
          {platformName}
        </span>
        <h1 className="fr-mt-1w text-left" data-testid="ServiceProviderHeaderComponent-spName">
          {spName}
        </h1>
      </React.Fragment>
    );
  },
);

ServiceProviderHeaderComponent.displayName = 'ServiceProviderHeaderComponent';

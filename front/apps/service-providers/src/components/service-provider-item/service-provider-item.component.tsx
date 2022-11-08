import classnames from 'classnames';
import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router-dom';

import { BadgeComponent, Breakpoints, Sizes } from '@fc/dsfr';

import styles from './service-provider-item.module.scss';
import { ServiceProviderItemDetailComponent } from './service-provider-item-detail.component';

export interface ServiceProviderItemComponentProps {
  color: string;
  spName: string;
  platformName: string;
  datapassId: string;
  createdAt: string;
  status: string;
  organisationName: string;
  url: string;
}

export const ServiceProviderItemComponent: React.FC<ServiceProviderItemComponentProps> = React.memo(
  ({
    color,
    createdAt,
    datapassId,
    organisationName,
    platformName,
    spName,
    status,
    url,
  }: ServiceProviderItemComponentProps) => {
    const gtMobile = useMediaQuery({ minWidth: Breakpoints.XS });

    return (
      <div
        className={classnames(styles.item, {
          // DSFR naming
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'fr-mb-2w': !gtMobile,
          // DSFR naming
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'fr-mb-3w': gtMobile,
        })}
        data-testid="ServiceProviderItemComponent">
        <div
          className={classnames({
            // Style helping naming
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'flex-rows flex-column-reverse fr-my-1w': !gtMobile,
            // Style helping naming
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'is-flex flex-between fr-mb-3v': gtMobile,
          })}>
          <Link
            className={classnames('fr-text--bold fr-m-0', {
              // DSFR naming
              // eslint-disable-next-line @typescript-eslint/naming-convention
              'fr-text--lg fr-mt-1w': !gtMobile,
              // DSFR naming
              // eslint-disable-next-line @typescript-eslint/naming-convention
              'fr-text--xl': gtMobile,
            })}
            data-testid="ServiceProviderItemComponent-spName"
            title="service-provider-details-pages"
            to={url}>
            {spName}
          </Link>
          <BadgeComponent
            noIcon
            colorName={color}
            dataTestId="ServiceProviderItemComponent-badge"
            label={status}
            size={gtMobile ? Sizes.MEDIUM : Sizes.SMALL}
          />
        </div>
        <div
          className={classnames(styles.details, {
            // DSFR naming
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'fr-text--md fr-mb-3w': gtMobile,
            // DSFR naming
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'fr-text--sm fr-mb-2w': !gtMobile,
          })}>
          <ServiceProviderItemDetailComponent
            dataTestId="ServiceProviderItemComponent-organisationName"
            label={organisationName}
          />
          <ServiceProviderItemDetailComponent
            dataTestId="ServiceProviderItemComponent-platform"
            label={platformName}
          />
          <ServiceProviderItemDetailComponent
            /** @NOTE =========> WARNING <=========
             *
             * warning icon put around the datapass number in the i18n
             * because we are not satisfied with the way of retrieving
             * the last datapass
             *
             */
            dataTestId="ServiceProviderItemComponent-datapassId"
            label={datapassId}
          />
          <ServiceProviderItemDetailComponent
            lastItem
            dataTestId="ServiceProviderItemComponent-createdAt"
            label={createdAt}
          />
        </div>
      </div>
    );
  },
);

ServiceProviderItemComponent.displayName = 'ServiceProviderItemComponent';

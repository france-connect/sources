import React from 'react';

import { Strings } from '@fc/common';
import { ConfigService } from '@fc/config';
import { LinkComponent } from '@fc/dsfr';
import { t } from '@fc/i18n';

import { ServiceProviderPermissionsTable } from '../../../components/tables';
import { CorePartnersOptions } from '../../../enums';
import type { ExternalUrlsInterface, ServiceProviderMetaInterface } from '../../../interfaces';

export interface ServiceProviderPermissionComponentProps {
  permissions: ServiceProviderMetaInterface['permissions'];
}

// @NOTE should be renamed to ServiceProviderContributorsComponent
export const ServiceProviderPermissionsComponent = React.memo(
  ({ permissions }: ServiceProviderPermissionComponentProps) => {
    const { datapassDocUrl } = ConfigService.get<ExternalUrlsInterface>(
      CorePartnersOptions.CONFIG_EXTERNAL_URLS,
    );

    return (
      <div className="fr-col-12 fr-col-lg-10 fr-col-xl-8 fr-mt-4w">
        <h2>{t('Partners.serviceProviderPage.usersSection.title')}</h2>
        <hr />
        <p>
          {t('Partners.serviceProviderPage.usersSection.description')}
          {Strings.WHITE_SPACE}
          <LinkComponent external href={datapassDocUrl}>
            {t('Partners.serviceProviderPage.usersSection.description.link')}
          </LinkComponent>
        </p>
        <ServiceProviderPermissionsTable permissions={permissions} />
      </div>
    );
  },
);

ServiceProviderPermissionsComponent.displayName = 'ServiceProviderPermissionsComponent';

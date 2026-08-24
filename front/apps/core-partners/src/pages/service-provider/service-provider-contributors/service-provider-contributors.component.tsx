import React from 'react';

import { Strings } from '@fc/common';
import { ConfigService } from '@fc/config';
import { Align, ButtonGroupComponent, IconPlacement, LinkComponent } from '@fc/dsfr';
import { t } from '@fc/i18n';

import { ContributorAlert, CreateContributorButton } from '../../../components';
import { ServiceProviderPermissionsTable } from '../../../components/tables';
import { CorePartnersOptions } from '../../../enums';
import { useCanCreateContributor } from '../../../hooks';
import type { ExternalUrlsInterface, ServiceProviderMetaInterface } from '../../../interfaces';

export interface ServiceProviderContributorsComponentProps {
  permissions: ServiceProviderMetaInterface['permissions'];
}

export const ServiceProviderContributorsComponent = React.memo(
  ({ permissions }: ServiceProviderContributorsComponentProps) => {
    const { datapassDocUrl } = ConfigService.get<ExternalUrlsInterface>(
      CorePartnersOptions.CONFIG_EXTERNAL_URLS,
    );

    const canCreateContributor = useCanCreateContributor();

    return (
      <div className="fr-col-12 fr-col-lg-10 fr-col-xl-8 fr-mt-4w">
        <h2>{t('Partners.serviceProviderPage.usersSection.title')}</h2>
        <hr />
        <ContributorAlert />
        <p>
          {t('Partners.serviceProviderPage.usersSection.description')}
          {Strings.WHITE_SPACE}
          <LinkComponent external href={datapassDocUrl}>
            {t('Partners.serviceProviderPage.usersSection.description.link')}
          </LinkComponent>
        </p>
        {canCreateContributor && (
          <ButtonGroupComponent align={Align.RIGHT} iconPlacement={IconPlacement.LEFT}>
            <CreateContributorButton />
          </ButtonGroupComponent>
        )}
        <ServiceProviderPermissionsTable permissions={permissions} />
      </div>
    );
  },
);

ServiceProviderContributorsComponent.displayName = 'ServiceProviderContributorsComponent';

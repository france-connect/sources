import React, { useMemo } from 'react';

import { Strings } from '@fc/common';
import type { TabGroupItemInterface } from '@fc/dsfr';
import { LinkComponent, TabsGroupComponent } from '@fc/dsfr';
import { t } from '@fc/i18n';

import { useServiceProviderScopes } from '../../../hooks';
import { ServiceProviderScopesTabViewComponent } from './scopes-tab-view/scopes-tab-view.component';

interface ServiceProviderScopesComponentProps {
  datapassScopes: string[];
  fcScopes: string[];
}

export const ServiceProviderScopesComponent = React.memo(
  ({ datapassScopes, fcScopes }: ServiceProviderScopesComponentProps) => {
    const { datapassDocUrl, scopeDocUrl, tabLists } = useServiceProviderScopes(
      datapassScopes,
      fcScopes,
    );

    const tabItems: TabGroupItemInterface[] = useMemo(() => {
      const items: TabGroupItemInterface[] = tabLists.map((list) => ({
        element: <ServiceProviderScopesTabViewComponent id={list.id} scopes={list.scopes} />,
        id: `${list.id}-scopes-tab-button`,
        label: t(`Partners.serviceProviderPage.scopeSection.${list.id}.title`),
      }));
      return items;
    }, [tabLists]);

    return (
      <div className="fr-col-12 fr-col-lg-10 fr-col-xl-8 fr-mt-4w">
        <h2>{t('Partners.serviceProviderPage.scopeSection.title')}</h2>
        <hr />
        <p>
          {t('Partners.serviceProviderPage.scopeSection.description')}
          {Strings.WHITE_SPACE}
          <LinkComponent external href={scopeDocUrl}>
            {t('Partners.serviceProviderPage.scopeSection.description.link')}
          </LinkComponent>
        </p>
        <TabsGroupComponent
          ariaLabel={t('Partners.serviceProviderPage.scopeSection.title')}
          dataTestId="service-provider-scopes-tabs"
          items={tabItems}
        />
        <p className="fr-mt-5w">
          {t('Partners.serviceProviderPage.datapassDocumentation.introduction')}
          {Strings.WHITE_SPACE}
          <LinkComponent external href={datapassDocUrl}>
            {t('Partners.serviceProviderPage.datapassDocumentation.introduction.link')}
          </LinkComponent>
        </p>
      </div>
    );
  },
);

ServiceProviderScopesComponent.displayName = 'ServiceProviderScopesComponent';

import React from 'react';

import { Strings } from '@fc/common';
import { ConfigService } from '@fc/config';
import type { ExternalUrlsInterface } from '@fc/core-partners';
import { CorePartnersOptions } from '@fc/core-partners';
import type { TabGroupItemInterface } from '@fc/dsfr';
import { AlertComponent, LinkComponent, TabsGroupComponent } from '@fc/dsfr';
import { t } from '@fc/i18n';

import { useServiceProvider } from '../../../hooks';
import { SandboxesSectionComponent } from './sandboxes-section';

export const ServiceProviderPage = React.memo(() => {
  const { datapassDocUrl, scopeDocUrl, spConfigurationDocUrl } =
    ConfigService.get<ExternalUrlsInterface>(CorePartnersOptions.CONFIG_EXTERNAL_URLS);

  const {
    closeAlertHandler,
    datapassRequestId,
    datapassScopes,
    fcScopes,
    habilitationLink,
    hasUnlinkedInstances,
    instances,
    name,
    organization,
    submitState,
  } = useServiceProvider();

  const tabItems: TabGroupItemInterface[] = [
    {
      element: (
        <div>
          <ul>
            {datapassScopes.map((scope, index) => {
              const key = `datapass-scope-${index}`;
              return (
                <li key={key} data-testid="service-provider-scopes-tabs-datapass-scope">
                  {scope}
                </li>
              );
            })}
          </ul>
        </div>
      ),
      id: 'datapass-scopes-tab-button',
      label: t('Partners.serviceProviderPage.datapassScopes.title'),
    },
    {
      element: (
        <div>
          <ul>
            {fcScopes.map((scope, index) => {
              const key = `fc-scope-${index}`;
              return (
                <li key={key} data-testid="service-provider-scopes-tabs-fc-scope">
                  {scope}
                </li>
              );
            })}
          </ul>
        </div>
      ),
      id: 'fc-scopes-tab-button',
      label: t('Partners.serviceProviderPage.fcScopes.title'),
    },
  ];

  return (
    <div className="fr-col-12 fr-col-lg-10 fr-col-xl-8">
      <div className="fr-col-12">
        <h1>{name}</h1>
        <p className="is-uppercase" data-testid="service-provider-details-page-organization-name">
          {organization.name}
        </p>
        <h2 className="fr-mt-7w">{t('Partners.serviceProviderPage.habilitation.title')}</h2>
        <hr />
        <ul>
          <li>
            <b>
              {t('Partners.serviceProviderPage.habilitation.number')}
              {Strings.WHITE_SPACE}
            </b>
            <LinkComponent
              external
              dataTestId="service-provider-details-page-datapass-request-id"
              href={habilitationLink}>
              {datapassRequestId}
            </LinkComponent>
          </li>
        </ul>
        <h2 className="fr-mt-5w">{t('Partners.serviceProviderPage.scopeSection.title')}</h2>
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
        <h2 className="fr-mt-7w">{t('Partners.serviceProviderPage.sandboxes.title')}</h2>
        <hr />
        {submitState && (
          <div className="fr-mb-3w">
            <AlertComponent
              dataTestId="service-provider-link-success-alert"
              title={t(submitState.message)}
              type={submitState.type}
              onClose={closeAlertHandler}>
              {t('Partners.serviceProviderPage.linkInstances.success.description')}
            </AlertComponent>
          </div>
        )}
        <p>
          {t('Partners.serviceProviderPage.sandboxes.description')}
          {Strings.WHITE_SPACE}
          <LinkComponent external href={spConfigurationDocUrl}>
            {t('Partners.serviceProviderPage.sandboxes.description.link')}
          </LinkComponent>
        </p>
        <SandboxesSectionComponent
          hasUnlinkedInstances={hasUnlinkedInstances}
          sandboxes={instances}
        />
      </div>
    </div>
  );
});

ServiceProviderPage.displayName = 'ServiceProviderPage';

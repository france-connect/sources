import React from 'react';

import { formatFullName, isoToDate, MessageTypes, truncateMiddle } from '@fc/common';
import type { InstanceItemInterface } from '@fc/core-partners';
import { AlertComponent, IconPlacement, LinkButton, TableComponent } from '@fc/dsfr';
import { t } from '@fc/i18n';
import { useStylesQuery, useStylesVariables } from '@fc/styles';

import { SandboxCardComponent, type SandboxSourceInterface } from './sandbox-card.component';

interface SandboxesSectionComponentProps {
  hasUnlinkedInstances: boolean;
  sandboxes: InstanceItemInterface[];
}

const mapSandboxesToSources = (sandboxes: InstanceItemInterface[]): SandboxSourceInterface[] =>
  sandboxes.map(({ createdAt, creator, currentVersion, id }) => ({
    clientId: truncateMiddle(currentVersion.data.client_id),
    createdAt: isoToDate(createdAt),
    creator: formatFullName(creator),
    id,
    label: currentVersion.data.name,
    name: currentVersion.data.name,
  }));

export const SandboxesSectionComponent = React.memo(
  ({ hasUnlinkedInstances, sandboxes }: SandboxesSectionComponentProps) => {
    const [breakpointLg] = useStylesVariables(['breakpoint-lg']);
    const gtDesktop = useStylesQuery({ minWidth: breakpointLg });

    const hasSandboxes = sandboxes.length > 0;

    if (!hasSandboxes) {
      return (
        <React.Fragment>
          {gtDesktop && hasUnlinkedInstances && (
            <div className="fr-mb-3w text-right">
              <LinkButton
                dataTestId="service-provider-link-instances-button"
                icon="links-line"
                iconPlacement={IconPlacement.LEFT}
                link="link-instances">
                {t('Partners.serviceProviderPage.sandboxes.linkInstances.button')}
              </LinkButton>
            </div>
          )}
          <AlertComponent
            dataTestId="service-provider-sandboxes-empty-alert"
            type={MessageTypes.INFO}>
            {t('Partners.serviceProviderPage.sandboxes.empty')}
          </AlertComponent>
        </React.Fragment>
      );
    }

    const sources = mapSandboxesToSources(sandboxes);

    if (gtDesktop) {
      return (
        <div className="fr-grid-row">
          <div className="fr-col-12">
            {hasUnlinkedInstances && (
              <div className="fr-mb-3w text-right">
                <LinkButton
                  dataTestId="service-provider-link-instances-button"
                  icon="links-line"
                  iconPlacement={IconPlacement.LEFT}
                  link="link-instances">
                  {t('Partners.serviceProviderPage.sandboxes.linkInstances.button')}
                </LinkButton>
              </div>
            )}
            <TableComponent
              multiline
              columns={[
                {
                  key: 'name',
                  label: t('Partners.serviceProviderPage.sandboxes.columns.instanceName'),
                  styles: 'fr-text--bold',
                },
                {
                  key: 'creator',
                  label: t('Partners.serviceProviderPage.sandboxes.columns.createdBy'),
                },
                {
                  key: 'clientId',
                  label: t('Partners.serviceProviderPage.sandboxes.columns.clientId'),
                },
                {
                  key: 'createdAt',
                  label: t('Partners.serviceProviderPage.sandboxes.columns.createdAt'),
                },
              ]}
              id="service-provider-sandboxes-table"
              sources={sources}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="fr-mt-3w">
        <div className="fr-grid-row fr-grid-row--gutters fr-mt-2w">
          {sources.map((source) => (
            <SandboxCardComponent key={source.id} source={source} />
          ))}
        </div>
      </div>
    );
  },
);

SandboxesSectionComponent.displayName = 'SandboxesSectionComponent';

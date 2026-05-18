import React from 'react';

import type { TableDataSourceInterface } from '@fc/dsfr';
import { CardComponent, Sizes } from '@fc/dsfr';
import { t } from '@fc/i18n';

export interface SandboxSourceInterface extends TableDataSourceInterface {
  clientId: string;
  createdAt: string;
  creator: string;
  id: string;
  label: string;
  name: string;
}

interface SandboxCardComponentProps {
  source: SandboxSourceInterface;
}

export const SandboxCardComponent = React.memo(({ source }: SandboxCardComponentProps) => (
  <div className="fr-col-12 fr-col-md-6" data-testid={`service-provider-sandbox-card-${source.id}`}>
    <CardComponent className="fr-mb-2w" size={Sizes.LARGE} title={source.name}>
      <p>
        <b className="is-block">{t('Partners.serviceProviderPage.sandboxes.card.createdAtBy')}</b>
        <span aria-hidden="true" className="fr-icon-calendar-event-fill fr-icon--sm" />{' '}
        <span data-testid={`sandbox-card-created-at-${source.id}`}>{source.createdAt}</span>
        <br />
        <span aria-hidden="true" className="fr-icon-user-setting-fill fr-icon--sm" />{' '}
        <span data-testid={`sandbox-card-created-by-${source.id}`}>{source.creator}</span>
      </p>
      <p>
        <b className="is-block">{t('Partners.serviceProviderPage.sandboxes.columns.clientId')}</b>
        <span data-testid={`sandbox-card-client-id-${source.id}`}>{source.clientId}</span>
      </p>
    </CardComponent>
  </div>
));

SandboxCardComponent.displayName = 'SandboxCardComponent';

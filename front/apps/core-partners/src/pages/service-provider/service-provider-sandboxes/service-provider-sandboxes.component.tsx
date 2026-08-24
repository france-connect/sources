import React from 'react';

import { MessageTypes, Strings } from '@fc/common';
import {
  AlertComponent,
  Align,
  ButtonGroupComponent,
  IconPlacement,
  LinkComponent,
} from '@fc/dsfr';
import { t } from '@fc/i18n';

import { CreateLinkedInstanceButton, LinkInstancesButton, SandboxAlert } from '../../../components';
import { ServiceProviderSandboxesTable } from '../../../components/tables';
import { useServiceProviderSandboxes } from '../../../hooks';
import type { InstanceInterface } from '../../../interfaces';

interface ServiceProviderSandboxesComponentProps {
  instances: InstanceInterface[];
}

export const ServiceProviderSandboxesComponent = React.memo(
  ({ instances }: ServiceProviderSandboxesComponentProps) => {
    const { deleteInstanceHandler, hasUnlinkedInstances, spConfigurationDocUrl } =
      useServiceProviderSandboxes();

    const hasSandboxes = instances.length > 0;

    return (
      <div className="fr-col-12 fr-col-lg-10 fr-col-xl-8 fr-mt-4w">
        <h2>{t('Partners.serviceProviderPage.sandboxes.title')}</h2>
        <hr />
        <SandboxAlert />
        <p>
          {t('Partners.serviceProviderPage.sandboxes.description')}
          {Strings.WHITE_SPACE}
          <LinkComponent external href={spConfigurationDocUrl}>
            {t('Partners.serviceProviderPage.sandboxes.description.link')}
          </LinkComponent>
        </p>
        <ButtonGroupComponent align={Align.RIGHT} iconPlacement={IconPlacement.LEFT}>
          {hasUnlinkedInstances && <LinkInstancesButton />}
          <CreateLinkedInstanceButton />
        </ButtonGroupComponent>
        {(!hasSandboxes && (
          <AlertComponent
            dataTestId="service-provider-sandboxes-empty-alert"
            type={MessageTypes.INFO}>
            {t('Partners.serviceProviderPage.sandboxes.empty')}
          </AlertComponent>
        )) || (
          <ServiceProviderSandboxesTable sandboxes={instances} onDelete={deleteInstanceHandler} />
        )}
      </div>
    );
  },
);

ServiceProviderSandboxesComponent.displayName = 'ServiceProviderSandboxesComponent';

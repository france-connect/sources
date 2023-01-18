import classnames from 'classnames';
import React from 'react';

import { AccordionGroupComponent, IconPlacement, Priorities, SimpleButton } from '@fc/dsfr';
import { t } from '@fc/i18n';

import { useServiceProviderSandbox } from '../../hooks';
import { transformServiceProviderConfig } from '../../services';
import { ItemsCounterComponent } from '../items-counter';
import styles from './service-provider-sandbox.module.scss';

interface ServiceProviderSandboxComponentProps {
  id: string;
}

export const ServiceProviderSandboxComponent = React.memo(
  ({ id }: ServiceProviderSandboxComponentProps) => {
    const { addConfig, configs } = useServiceProviderSandbox(id);
    const itemsTransformed = configs.total !== 0 && transformServiceProviderConfig(configs.items);

    return (
      <div
        className={classnames('fr-container fr-p-3w', styles.sandboxContainer)}
        data-testid="ServiceProviderSandboxComponent-container">
        <div className="fr-grid-row">
          <h3
            className="fr-col text-left is-blue-france"
            data-testid="ServiceProviderSandboxComponent-sp-config-title">
            {t('ServiceProviderSandbox.title')}
          </h3>
          {itemsTransformed && (
            <div className="fr-col text-right">
              <ItemsCounterComponent count={configs.total} total="XX" />
            </div>
          )}
        </div>
        {itemsTransformed && <AccordionGroupComponent items={itemsTransformed} />}
        <SimpleButton
          noOutline
          className={styles.addConfigButton}
          dataTestId="ServiceProviderSandboxComponent-add-config-button"
          icon="add-line"
          iconPlacement={IconPlacement.LEFT}
          label={t('ServiceProviderSandbox.addConfig')}
          priority={Priorities.TERTIARY}
          onClick={addConfig}
        />
      </div>
    );
  },
);

ServiceProviderSandboxComponent.displayName = 'ServiceProviderSandboxComponent';

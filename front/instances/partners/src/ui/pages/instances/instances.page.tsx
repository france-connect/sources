import React from 'react';
import { ScrollRestoration } from 'react-router-dom';

import { CreateInstanceButton, InstancesListComponent } from '@fc/core-partners';
import { AlertComponentV2, Sizes, TileComponent } from '@fc/dsfr';
import { t } from '@fc/i18n';

import { useInstances } from '../../../hooks';

export const InstancesPage = React.memo(() => {
  const { closeAlertHandler, hasItems, items, submitState } = useInstances();

  return (
    <div className="fr-col-12 fr-col-md-6">
      <div className="fr-col-12">
        <h1 data-testid="instances-page-title">{t('Partners.homepage.sandboxTitle')}</h1>
      </div>
      {submitState && (
        <AlertComponentV2
          dataTestId="instances-page-alert-top"
          title={t(submitState.message)}
          type={submitState.type}
          onClose={closeAlertHandler}
        />
      )}
      {hasItems && (
        <React.Fragment>
          <div className="fr-col-12">
            <CreateInstanceButton />
          </div>
          <div className="fr-col-12">
            <InstancesListComponent items={items} />
          </div>
        </React.Fragment>
      )}
      {!hasItems && (
        <div className="fr-col-12">
          <TileComponent
            isHorizontal
            dataTestId="instances-page-create-tile"
            description={t('Partners.homepage.createTileDescription')}
            link="create"
            size={Sizes.LARGE}
            title={t('Partners.homepage.createTileTitle')}
          />
        </div>
      )}
      <div className="fr-col-12">
        <TileComponent
          isHorizontal
          dataTestId="instances-page-sandbox-tile"
          description={t('Partners.homepage.sandboxTileDescription')}
          link="."
          size={Sizes.LARGE}
          title={t('Partners.homepage.sandboxTileTitle')}
        />
      </div>
      {submitState && <ScrollRestoration />}
    </div>
  );
});

InstancesPage.displayName = 'InstancesPage';

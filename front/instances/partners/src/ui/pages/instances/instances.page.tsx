import React, { useEffect } from 'react';

import { useScrollTo } from '@fc/common';
import { CreateInstanceButton, InstancesListComponent } from '@fc/core-partners';
import { AlertComponent, Sizes, TileComponent } from '@fc/dsfr';
import { t } from '@fc/i18n';

import { useInstances } from '../../../hooks';

export const InstancesPage = React.memo(() => {
  const { scrollToTop } = useScrollTo();
  const { closeAlertHandler, hasItems, items, submitState } = useInstances();

  useEffect(() => {
    scrollToTop();
  }, [submitState, scrollToTop]);

  return (
    <div className="fr-col-12 fr-col-md-6">
      <div className="fr-col-12">
        <h1 data-testid="instances-page-title">{t('Partners.homepage.sandboxTitle')}</h1>
      </div>
      {submitState && (
        <AlertComponent
          className="fr-mb-3w"
          dataTestId="instances-page-alert-top"
          title={t(submitState.message)}
          type={submitState.type}
          onClose={closeAlertHandler}
        />
      )}
      {hasItems && (
        <React.Fragment>
          <div className="fr-col-12 fr-mb-3w">
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
    </div>
  );
});

InstancesPage.displayName = 'InstancesPage';

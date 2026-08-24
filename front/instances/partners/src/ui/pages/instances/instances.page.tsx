import React, { useEffect } from 'react';

import { useScrollTo } from '@fc/common';
import { CreateUnlinkedInstanceButton, InstancesListComponent } from '@fc/core-partners';
import { AlertComponent, Sizes, TileComponent } from '@fc/dsfr';
import { SeeAlsoElement } from '@fc/forms';
import { t } from '@fc/i18n';

import { useInstances } from '../../../hooks';

export const InstancesPage = React.memo(() => {
  const { scrollToTop } = useScrollTo();
  const { cleanupRouteState, hasItems, items, submitState } = useInstances();

  useEffect(() => {
    scrollToTop();
  }, [submitState, scrollToTop]);

  return (
    <React.Fragment>
      <div className="fr-col-12 fr-col-lg-10 fr-col-xl-8">
        <h1 data-testid="instances-page-title">{t('Partners.homepage.sandboxTitle')}</h1>
        <p>
          {t('Partners.homepage.baseline')}{' '}
          <SeeAlsoElement
            id="doc-sandbox"
            url="https://docs.partenaires.franceconnect.gouv.fr/fs/devenir-fs/projet-bac-a-sable/"
          />
        </p>
      </div>
      {submitState && (
        <div className="fr-col-12 fr-col-lg-10 fr-col-xl-8 fr-mb-3w">
          <AlertComponent
            dataTestId="instances-page-alert-top"
            title={t(submitState.title)}
            type={submitState.type}
            onClose={cleanupRouteState}
          />
        </div>
      )}
      {hasItems && (
        <React.Fragment>
          <div className="fr-col-12 fr-col-lg-10 fr-col-xl-8 fr-mb-3w">
            <CreateUnlinkedInstanceButton />
          </div>
          <div className="fr-col-12 fr-col-lg-10 fr-col-xl-8">
            <InstancesListComponent items={items} />
          </div>
        </React.Fragment>
      )}
      {!hasItems && (
        <div className="fr-col-12 fr-col-lg-10 fr-col-xl-8">
          <TileComponent
            isHorizontal
            dataTestId="instances-page-create-tile"
            description={t('Partners.homepage.createTileDescription')}
            link="creer-instance"
            size={Sizes.LARGE}
            title={t('Partners.homepage.createTileTitle')}
          />
        </div>
      )}
    </React.Fragment>
  );
});

InstancesPage.displayName = 'InstancesPage';

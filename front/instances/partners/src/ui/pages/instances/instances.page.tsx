import React, { useEffect } from 'react';

import { useScrollTo } from '@fc/common';
import { CreateInstanceButton, InstancesListComponent } from '@fc/core-partners';
import { AlertComponent, LinkEmailComponent, Sizes, TileComponent } from '@fc/dsfr';
import { SeeAlsoElement } from '@fc/forms';
import { t } from '@fc/i18n';

import { useInstances } from '../../../hooks';

export const InstancesPage = React.memo(() => {
  const { scrollToTop } = useScrollTo();
  const { closeAlertHandler, hasItems, items, submitState } = useInstances();

  useEffect(() => {
    scrollToTop();
  }, [submitState, scrollToTop]);

  return (
    <div className="fr-col-12 fr-col-lg-10 fr-col-xl-8">
      <div className="fr-col-12">
        <h1 data-testid="instances-page-title">{t('Partners.homepage.sandboxTitle')}</h1>
        <p>
          {t('Partners.homepage.baseline')}{' '}
          <SeeAlsoElement
            id="doc-sandbox"
            url="https://docs.partenaires.franceconnect.gouv.fr/fs/devenir-fs/projet-bac-a-sable/"
          />
        </p>
      </div>
      <div className="fr-col-12 fr-mb-3w fr-mt-5w">
        <AlertComponent title="Vous ne trouvez pas l’instance de votre fournisseur de service, bien que la demande de création ait été faite via Démarches Simplifiées ?">
          <ul>
            <li>
              Si vous n’aviez pas renseigné de numéro d’habilitation (Datapass), nous vous invitons
              à créer une nouvelle instance depuis cet espace.
            </li>
            <li>
              Si vous aviez saisi un numéro de demande d’habilitation, vous pouvez soit contacter le
              support partenaire à l’adresse{' '}
              <LinkEmailComponent email="support.partenaires@franceconnect.gouv.fr" />, soit créer à
              nouveau votre instance depuis cet espace.
            </li>
          </ul>
        </AlertComponent>
      </div>
      {submitState && (
        <div className="fr-col-12 fr-mb-3w">
          <AlertComponent
            dataTestId="instances-page-alert-top"
            title={t(submitState.message)}
            type={submitState.type}
            onClose={closeAlertHandler}
          />
        </div>
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

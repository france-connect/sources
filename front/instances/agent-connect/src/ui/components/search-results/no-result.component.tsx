import classnames from 'classnames';
import React, { useContext } from 'react';

import { useAddToUserHistory } from '@fc/agent-connect-history';
import { AgentConnectSearchContext } from '@fc/agent-connect-search';
import { RedirectToIdpFormComponent } from '@fc/oidc-client';

import { MONCOMPTEPRO_UID } from '../../../config';
import styles from './search-results.module.scss';

export interface NoResultProps {
  isMoncompteProAvailable: boolean;
}

export const NoResultComponent = React.memo(({ isMoncompteProAvailable }: NoResultProps) => {
  const { payload } = useContext(AgentConnectSearchContext);
  const { csrfToken } = payload;

  const addToUserHistory = useAddToUserHistory(MONCOMPTEPRO_UID);
  if (!isMoncompteProAvailable) {
    return (
      <div className="fr-mx-2w" id="identity-provider-result">
        <h3 className="fr-text--md">Aucun fournisseur d’identité n’a été trouvé</h3>
      </div>
    );
  }
  return (
    <div>
      <div className="fr-mx-2w" id="identity-provider-result">
        <h3 className="fr-text--md">Nous ne trouvons pas votre administration</h3>
        <p className="fr-text--md">Vous pouvez continuer en utilisant MonComptePro</p>
      </div>
      <RedirectToIdpFormComponent
        csrf={csrfToken}
        id={`fca-search-idp-${MONCOMPTEPRO_UID}`}
        uid={MONCOMPTEPRO_UID}>
        <button
          aria-label="Se connecter à MonComptePro"
          className={classnames(styles.moncompteprobutton)}
          id={`idp-${MONCOMPTEPRO_UID}-button`}
          type="submit"
          onClick={addToUserHistory}
        />
        <p>
          <a
            href="https://moncomptepro.beta.gouv.fr/"
            rel="noopener noreferrer"
            target="_blank"
            title="Qu’est-ce que MonComptePro ? - nouvelle fenêtre">
            Qu’est-ce que MonComptePro ?
          </a>
        </p>
      </RedirectToIdpFormComponent>
    </div>
  );
});

NoResultComponent.displayName = 'NoResultComponent';

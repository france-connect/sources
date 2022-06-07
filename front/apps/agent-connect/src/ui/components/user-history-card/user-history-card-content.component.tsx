import classnames from 'classnames';
import React, { useContext } from 'react';
import { useMediaQuery } from 'react-responsive';

import { AgentConnectSearchContext, IdentityProvider } from '@fc/agent-connect-search';
import { RedirectToIdpFormComponent } from '@fc/oidc-client';

import styles from './user-history-card-content.module.scss';

type UserHistoryCardContentComponentProps = {
  identityProvider: IdentityProvider;
};

export const UserHistoryCardContentComponent = React.memo(
  ({ identityProvider }: UserHistoryCardContentComponentProps) => {
    const { active, name, uid } = identityProvider;

    const gtTablet = useMediaQuery({ query: '(min-width: 768px)' });

    const {
      payload: { csrfToken },
    } = useContext(AgentConnectSearchContext);

    return (
      <div
        className={classnames(styles.content, 'flex-center use-pointer', {
          // Class CSS
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'fr-p-3w': !gtTablet,
          // Class CSS
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'fr-px-3w fr-pt-3w': gtTablet,
        })}
        data-testid="container">
        <div className="fr-mb-1w is-g700">Mon compte</div>
        <RedirectToIdpFormComponent csrf={csrfToken} id={`fca-history-idp-${uid}`} uid={uid}>
          <button
            className={classnames(styles.title, 'fr-text--bold fr-text--xl fr-mb-0')}
            disabled={!active}
            type="submit">
            {name}
          </button>
        </RedirectToIdpFormComponent>
      </div>
    );
  },
);

UserHistoryCardContentComponent.displayName = 'UserHistoryCardContentComponent';

import classNames from 'classnames';
import React, { useContext } from 'react';
import { useMediaQuery } from 'react-responsive';

import { AgentConnectSearchContext, IdentityProvider } from '@fc/agent-connect-search';
import { RedirectToIdpFormComponent } from '@fc/oidc-client';

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
        className={classNames('flex-center rounded card-wrapper bg-blue-france-100', {
          p24: !gtTablet,
          'px24 pt24': gtTablet,
        })}
        data-testid="container">
        <div className="mb8 is-g700">Mon compte</div>
        <RedirectToIdpFormComponent csrf={csrfToken} id={`fca-history-idp-${uid}`} uid={uid}>
          <button
            className="is-blue-agentconnect is-bold fr-text-lead"
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

import classnames from 'classnames';
import React, { useContext } from 'react';
import { useMediaQuery } from 'react-responsive';

import { useUserHistory } from '@fc/agent-connect-history';
import { AgentConnectSearchContext } from '@fc/agent-connect-search';

import { UserHistoryCardComponent } from '../user-history-card';

export const UserHistoryComponent = React.memo(() => {
  const gtTablet = useMediaQuery({ query: '(min-width: 768px)' });
  const { payload } = useContext(AgentConnectSearchContext);
  const items = useUserHistory(payload.identityProviders);
  const shouldShowLabel = items && items.length > 0;

  if (!shouldShowLabel) {
    return null;
  }

  return (
    <div>
      <div className="fr-mx-2w">
        <p
          className={classnames('fr-my-1v fr-text--xl fr-text--bold', {
            // Class CSS
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'text-center': gtTablet,
          })}
          data-testid="title">
          J&rsquo;utilise à nouveau
        </p>
      </div>
      <div
        className={classnames('fr-mb-5w', {
          // Class CSS
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'flex-center': gtTablet,
          // Class CSS
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'flex-columns': gtTablet,
          // Class CSS
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'flex-rows': !gtTablet,
        })}
        data-testid="list">
        {items.map((idp) => (
          <UserHistoryCardComponent key={idp.uid} item={idp} />
        ))}
      </div>
    </div>
  );
});

UserHistoryComponent.displayName = 'UserHistoryComponent';

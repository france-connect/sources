import classNames from 'classnames';
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
  return (
    <div>
      {shouldShowLabel && (
        <div className="mx16">
          <p
            className={classNames('my4 fs20 is-bold', { 'text-center': gtTablet })}
            data-testid="title">
            J&rsquo;utilise à nouveau
          </p>
        </div>
      )}
      <div
        className={classNames('mb40', {
          'flex-center': gtTablet,
          'flex-columns': gtTablet,
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

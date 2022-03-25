import './user-history-card.scss';

import React from 'react';

import { IdentityProvider } from '@fc/agent-connect-search';

import { UserHistoryCardContentComponent } from './user-history-card-content.component';
import { UserHistoryCardRemoveButtonComponent } from './user-history-card-remove-button.component';

type UserHistoryCardComponentProps = {
  item: IdentityProvider;
};

export const UserHistoryCardComponent = React.memo(({ item }: UserHistoryCardComponentProps) => (
  <div className="flex-column text-center m16 user-history-card">
    <UserHistoryCardContentComponent identityProvider={item} />
    <UserHistoryCardRemoveButtonComponent uid={item.uid} />
  </div>
));

UserHistoryCardComponent.displayName = 'UserHistoryCardComponent';

import classnames from 'classnames';
import React from 'react';

import { IdentityProvider } from '@fc/agent-connect-search';

import styles from './user-history-card.module.scss';
import { UserHistoryCardContentComponent } from './user-history-card-content.component';
import { UserHistoryCardRemoveButtonComponent } from './user-history-card-remove-button.component';

type UserHistoryCardComponentProps = {
  item: IdentityProvider;
};

export const UserHistoryCardComponent = React.memo(({ item }: UserHistoryCardComponentProps) => (
  <div className={classnames(styles.card, 'flex-column text-center fr-m-2w user-history-card')}>
    <UserHistoryCardContentComponent identityProvider={item} />
    <UserHistoryCardRemoveButtonComponent uid={item.uid} />
  </div>
));

UserHistoryCardComponent.displayName = 'UserHistoryCardComponent';

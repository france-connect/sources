import classnames from 'classnames';
import React from 'react';

import { useRemoveFromUserHistory } from '@fc/agent-connect-history';

import styles from './user-history-card-remove-button.module.scss';

type UserHistoryCardRemoveButtonComponentProps = {
  uid: string;
};

export const UserHistoryCardRemoveButtonComponent = React.memo(
  ({ uid }: UserHistoryCardRemoveButtonComponentProps) => {
    const removeFromUserHistory = useRemoveFromUserHistory(uid);
    return (
      <button
        className={classnames(
          styles.button,
          'fr-btn fr-btn--tertiary-no-outline fr-btn--sm fr-m-1w',
        )}
        data-testid="remove-button"
        type="button"
        onClick={() => removeFromUserHistory()}>
        Supprimer de cette liste
      </button>
    );
  },
);

UserHistoryCardRemoveButtonComponent.displayName = 'UserHistoryCardRemoveButtonComponent';

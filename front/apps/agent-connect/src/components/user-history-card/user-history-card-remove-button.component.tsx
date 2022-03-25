import React from 'react';

import { useRemoveFromUserHistory } from '@fc/agent-connect-history';

type UserHistoryCardRemoveButtonComponentProps = {
  uid: string;
};

export const UserHistoryCardRemoveButtonComponent = React.memo(
  ({ uid }: UserHistoryCardRemoveButtonComponentProps) => {
    const removeFromUserHistory = useRemoveFromUserHistory(uid);
    return (
      <button
        className="m8 fr-text-sm"
        data-testid="remove-button"
        type="button"
        onClick={() => removeFromUserHistory()}>
        Supprimer de cette liste
      </button>
    );
  },
);

UserHistoryCardRemoveButtonComponent.displayName = 'UserHistoryCardRemoveButtonComponent';

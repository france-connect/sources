import './styles.scss';

import React from 'react';
import { useSelector } from 'react-redux';

import { selectIdentityProviderByUID } from '../../redux/selectors';
import { RootState } from '../../types';
import { IdentityProviderCardContentComponent } from './card-content';
import { RemoveButtonComponent } from './remove-button';

type IdentityProviderCardProps = {
  uid: string;
};

export const IdentityProviderHistoryCardComponent = React.memo(
  ({ uid }: IdentityProviderCardProps): JSX.Element => {
    const identityProvider = useSelector((state: RootState) =>
      selectIdentityProviderByUID(state, uid),
    );

    return (
      <div className="flex-column text-center m16 identity-provider-card">
        {identityProvider && (
          <React.Fragment>
            <IdentityProviderCardContentComponent identityProvider={identityProvider} />
            <RemoveButtonComponent uid={uid} />
          </React.Fragment>
        )}
      </div>
    );
  },
);

IdentityProviderHistoryCardComponent.displayName = 'IdentityProviderHistoryCardComponent';

import './styles.scss';

import React from 'react';
import { useSelector } from 'react-redux';

import { selectIdentityProviderByUID } from '../../redux/selectors';
import { RootState } from '../../types';
import CardContent from './card-content';
import RemoveButton from './remove-button';

type IdentityProviderCardProps = {
  uid: string;
};

const IdentityProviderHistoryCardComponent = React.memo(
  ({ uid }: IdentityProviderCardProps): JSX.Element => {
    const identityProvider = useSelector((state: RootState) =>
      selectIdentityProviderByUID(state, uid),
    );

    return (
      <div className="flex-column text-center m16 identiy-provider-card">
        {identityProvider && (
          <React.Fragment>
            <CardContent identityProvider={identityProvider} />
            <RemoveButton uid={uid} />
          </React.Fragment>
        )}
      </div>
    );
  },
);

IdentityProviderHistoryCardComponent.displayName =
  'IdentityProviderHistoryCardComponent';

export default IdentityProviderHistoryCardComponent;

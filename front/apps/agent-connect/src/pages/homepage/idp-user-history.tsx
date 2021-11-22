import './idp-user-history.scss';

import React from 'react';

import IdentityProviderHistoryCard from '../../components/history-card';

type IdentityProvidersHistoryProps = {
  items: string[];
};

const IdentityProvidersUserHistoryComponent = React.memo(
  ({ items }: IdentityProvidersHistoryProps): JSX.Element => (
    <div className="mb-8" id="identity-providers-user-history">
      <div className="text-center mb-4">
        <h4 className="my4 font-weight-bold">J&apos;utilise à nouveau</h4>
      </div>
      <div className="flex-columns justify-content-center col-md-12 col-sm-12 wrapper">
        {items.map((identityProviderUID: string) => (
          <IdentityProviderHistoryCard
            key={identityProviderUID}
            uid={identityProviderUID}
          />
        ))}
      </div>
    </div>
  ),
);

IdentityProvidersUserHistoryComponent.displayName =
  'IdentityProvidersUserHistoryComponent';

export default IdentityProvidersUserHistoryComponent;

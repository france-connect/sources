import './idp-user-history.scss';

import React from 'react';
import classnames from 'classnames';
import { useMediaQuery } from 'react-responsive';

import IdentityProviderHistoryCard from '../../components/history-card';

type IdentityProvidersHistoryProps = {
  items: string[];
};

const IdentityProvidersUserHistoryComponent = React.memo(
  ({ items }: IdentityProvidersHistoryProps): JSX.Element => {
    const gtTablet = useMediaQuery({ query: '(min-width: 768px)' });
  
    return (
      <div className="mb-8" id="identity-providers-user-history">
        <div className="mx16 mb-4">
          <p className={classnames("my4 fs20 is-bold", {"text-center": gtTablet})}>J&apos;utilise à nouveau</p>
        </div>
        <div className={classnames("flex-columns justify-content-center mb40 col-md-12 col-sm-12 wrapper", {"flex-columns": gtTablet, "flex-rows": !gtTablet})}>
          {items.map((identityProviderUID: string) => (
            <IdentityProviderHistoryCard
              key={identityProviderUID}
              uid={identityProviderUID}
            />
          ))}
        </div>
      </div>
    );
  }
);

IdentityProvidersUserHistoryComponent.displayName =
  'IdentityProvidersUserHistoryComponent';

export default IdentityProvidersUserHistoryComponent;

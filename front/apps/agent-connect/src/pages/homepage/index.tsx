/* istanbul ignore file */

/**
 * Tested with cypress snapshots
 */
import React from 'react';
import { useSelector } from 'react-redux';

import FCAApiContext from '../../components/fca-api-context';
import { RootState } from '../../types';
import IdentityProvidersUserHistory from './idp-user-history';
import Search from './search';
import ServiceProviderName from './sp-name';

const HomePage = React.memo((): JSX.Element => {
  const identityProvidersHistory = useSelector(
    (state: RootState) => state.identityProvidersHistory,
  );

  const showUserHistory = identityProvidersHistory?.length > 0;

  return (
    <FCAApiContext>
      <React.Fragment>
        <ServiceProviderName />
        {showUserHistory && (
          <IdentityProvidersUserHistory items={identityProvidersHistory} />
        )}
        <Search />
      </React.Fragment>
    </FCAApiContext>
  );
});

HomePage.displayName = 'HomePage';

export default HomePage;

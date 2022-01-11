/* istanbul ignore file */

/**
 * Tested with cypress snapshots
 */
import React from 'react';
import { RiQuestionFill as QuestionIcon } from 'react-icons/ri';
import { useSelector } from 'react-redux';

import { FCAApiContextComponent } from '../../components/fca-api-context';
import { RootState } from '../../types';
import { IdentityProvidersUserHistoryComponent } from './idp-user-history';
import { SearchComponent } from './search';
import { ServiceProviderNameComponent } from './sp-name';

export const HomePage = React.memo((): JSX.Element => {
  const identityProvidersHistory = useSelector(
    (state: RootState) => state.identityProvidersHistory,
  );

  const showUserHistory = identityProvidersHistory?.length > 0;

  return (
    <FCAApiContextComponent>
      <React.Fragment>
        <ServiceProviderNameComponent />
        {showUserHistory && (
          <IdentityProvidersUserHistoryComponent items={identityProvidersHistory} />
        )}
        <SearchComponent />
        <div className="mt48">
          <a
            href="https://agentconnect.gouv.fr/aide"
            className="is-g600 flex-columns flex-center items-center">
            <QuestionIcon color="#0579EE" size="20" role="img" className="mr4" />
            J’ai besoin d’aide
          </a>
        </div>
      </React.Fragment>
    </FCAApiContextComponent>
  );
});

HomePage.displayName = 'HomePage';

/* istanbul ignore file */

/**
 * Tested with cypress snapshots
 */
import React from 'react';
import { useSelector } from 'react-redux';
import { RiQuestionFill as QuestionIcon } from 'react-icons/ri';

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
        <div className="mt48">
          <a
            href="https://agentconnect.gouv.fr/aide"
            className="is-g600 flex-columns flex-center items-center"
          >
            <QuestionIcon
              color="#0579EE"
              size="20"
              role="img"
              className="mr4"
            />
            J’ai besoin d’aide
          </a>
        </div>
      </React.Fragment>
    </FCAApiContext>
  );
});

HomePage.displayName = 'HomePage';

export default HomePage;

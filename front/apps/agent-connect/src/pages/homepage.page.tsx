import React from 'react';
import { RiQuestionFill as QuestionIcon } from 'react-icons/ri';

import { SearchComponent, ServiceProviderNameComponent, UserHistoryComponent } from '../components';

export const HomePage = React.memo(() => (
  <React.Fragment>
    <ServiceProviderNameComponent />
    <UserHistoryComponent />
    <SearchComponent />
    <div className="mt48">
      <a
        className="is-g600 flex-columns flex-center items-center"
        data-testid="help-link"
        href="https://agentconnect.gouv.fr/aide">
        <QuestionIcon className="mr4" color="#0579EE" role="img" size="20" />
        J’ai besoin d’aide
      </a>
    </div>
  </React.Fragment>
));

HomePage.displayName = 'HomePage';

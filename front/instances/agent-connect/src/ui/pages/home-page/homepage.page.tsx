import classnames from 'classnames';
import React from 'react';
import { Helmet } from 'react-helmet';
import { useMediaQuery } from 'react-responsive';

import { LinkComponent, Sizes } from '@fc/dsfr';

import {
  SearchComponent,
  ServiceProviderNameComponent,
  UserHistoryComponent,
} from '../../components';
import styles from './homepage.module.scss';

export const HomePage = React.memo(() => {
  const gtTablet = useMediaQuery({ query: '(min-width: 768px)' });
  return (
    <React.Fragment>
      <Helmet>
        <title>AgentConnect - Accueil</title>
      </Helmet>
      <div
        className={classnames({
          // Class CSS
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'fr-mt-4w': !gtTablet,
          // Class CSS
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'fr-mt-8w': gtTablet,
        })}>
        <ServiceProviderNameComponent />
        <UserHistoryComponent />
        <SearchComponent />
        <div className="text-center fr-mt-6w">
          <LinkComponent
            className={styles.link}
            href="https://agentconnect.gouv.fr/aide"
            icon="question-fill"
            label="J’ai besoin d’aide"
            size={Sizes.LARGE}
          />
        </div>
      </div>
    </React.Fragment>
  );
});

HomePage.displayName = 'HomePage';

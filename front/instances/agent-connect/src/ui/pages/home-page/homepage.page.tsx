import classnames from 'classnames';
import React from 'react';
import { useMediaQuery } from 'react-responsive';

import { LinkComponent, Sizes } from '@fc/dsfr';

import {
  SearchComponent,
  ServiceProviderNameComponent,
  UserHistoryComponent,
} from '../../components';
import styles from './homepage.module.scss';

export interface HomePageProps {
  size?: Sizes;
}

export const HomePage: React.FC<HomePageProps> = React.memo(({ size }: HomePageProps) => {
  const gtTablet = useMediaQuery({ query: '(min-width: 768px)' });
  return (
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
          size={size}
        />
      </div>
    </div>
  );
});

HomePage.defaultProps = {
  size: Sizes.LARGE,
};

HomePage.displayName = 'HomePage';

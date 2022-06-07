import classnames from 'classnames';
import React, { useContext } from 'react';
import { useMediaQuery } from 'react-responsive';

import { AgentConnectSearchContext } from '@fc/agent-connect-search';

import styles from './service-provider-name.module.scss';

export const ServiceProviderNameComponent = React.memo(() => {
  const gtTablet = useMediaQuery({ query: '(min-width: 768px)' });
  const { payload } = useContext(AgentConnectSearchContext);
  const { serviceProviderName } = payload;

  return (
    // Class CSS
    // eslint-disable-next-line @typescript-eslint/naming-convention
    <section className={classnames('fr-px-2w', { 'text-center': gtTablet })} data-testid="wrapper">
      <h1 className={classnames('fr-h4 fr-mb-2w', styles.pretitle)} data-testid="title">
        Je choisis un compte pour me connecter sur
      </h1>
      <h2
        className={classnames('fr-h1', styles.title, {
          // Class CSS
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'fr-mb-5w': !gtTablet,
          // Class CSS
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'fr-mb-8w': gtTablet,
        })}
        data-testid="subtitle">
        <span>{serviceProviderName}</span>
      </h2>
    </section>
  );
});

ServiceProviderNameComponent.displayName = 'ServiceProviderNameComponent';

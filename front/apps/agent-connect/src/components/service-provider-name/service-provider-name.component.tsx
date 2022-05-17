import classNames from 'classnames';
import React, { useContext } from 'react';
import { useMediaQuery } from 'react-responsive';

import { AgentConnectSearchContext } from '@fc/agent-connect-search';

export const ServiceProviderNameComponent = React.memo(() => {
  const gtTablet = useMediaQuery({ query: '(min-width: 768px)' });
  const { payload } = useContext(AgentConnectSearchContext);
  const { serviceProviderName } = payload;

  return (
    // Class CSS
    // eslint-disable-next-line @typescript-eslint/naming-convention
    <section className={classNames({ 'text-center': gtTablet })} data-testid="wrapper">
      <h1
        // Class CSS
        // eslint-disable-next-line @typescript-eslint/naming-convention
        className={classNames('mx16 mb16', { 'fr-text-lg': !gtTablet, fs28: gtTablet })}
        data-testid="title">
        Je choisis un compte pour me connecter sur
      </h1>
      <h2
        className={classNames('is-extra-bold is-blue-agentconnect mx16', {
          // Class CSS
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'fs32 mb40': !gtTablet,
          // Class CSS
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'fs40 mb64': gtTablet,
        })}
        data-testid="subtitle">
        <span>{serviceProviderName}</span>
      </h2>
    </section>
  );
});

ServiceProviderNameComponent.displayName = 'ServiceProviderNameComponent';

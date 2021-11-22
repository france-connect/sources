/* istanbul ignore file */

/**
 * Tested with cypress snapshots
 */
import React from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../types';

const ServiceProviderNameComponent = React.memo((): JSX.Element => {
  const serviceProviderName = useSelector(
    (state: RootState) => state.serviceProviderName,
  );

  return (
    <section className="row mt-5 mb-5 text-center">
      <h4 className="mt8 mx120 mb16">
        Je choisis un compte pour me connecter sur
      </h4>
      <h1 style={{ color: '#1890ff' }}>
        <span>{serviceProviderName}</span>
      </h1>
    </section>
  );
});

ServiceProviderNameComponent.displayName = 'ServiceProviderNameComponent';

export default ServiceProviderNameComponent;

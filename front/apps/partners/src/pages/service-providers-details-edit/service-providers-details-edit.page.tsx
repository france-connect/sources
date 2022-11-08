import classnames from 'classnames';
import React from 'react';
import { useParams } from 'react-router-dom';

import { ServiceProviderEditActionTypes } from '@fc/service-providers';

import { ServiceProvidersDetailsHeaderComponent } from '../../components';
import { useServiceProviderDetails } from '../../hooks';
import styles from './service-providers-details-edit.module.scss';

export const ServiceProvidersDetailsEditPage = React.memo(() => {
  const { id } = useParams() as { id: string };
  const { item } = useServiceProviderDetails({
    id,
    type: ServiceProviderEditActionTypes.SERVICE_PROVIDER_EDIT_REQUESTED,
  });

  return (
    <div>
      {item && (
        <div className="fr-container fr-mt-3w">
          <ServiceProvidersDetailsHeaderComponent item={item} />
          <div className={classnames('fr-text--sm fr-text--bold is-uppercase', styles.textDetail)}>
            Mode édition
          </div>
        </div>
      )}
    </div>
  );
});

ServiceProvidersDetailsEditPage.displayName = 'ServiceProvidersDetailsEditPage';

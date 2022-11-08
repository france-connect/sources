import classnames from 'classnames';
import React from 'react';
import { useParams } from 'react-router-dom';

import { ServiceProviderHeaderComponent } from '../../../components';
import { ServiceProviderEditActionTypes } from '../../../enums';
import { useServiceProviderDetails } from '../../../hooks';
import styles from './service-provider-edit.module.scss';

export const ServiceProviderEditPage = React.memo(() => {
  const { id } = useParams() as { id: string };
  const { item } = useServiceProviderDetails({
    id,
    type: ServiceProviderEditActionTypes.SERVICE_PROVIDER_EDIT_REQUESTED,
  });

  return (
    <div>
      {item && (
        <div className="fr-container fr-mt-3w">
          <ServiceProviderHeaderComponent item={item} />
          <div className={classnames('fr-text--sm fr-text--bold is-uppercase', styles.textDetail)}>
            Mode édition
          </div>
        </div>
      )}
    </div>
  );
});

ServiceProviderEditPage.displayName = 'ServiceProviderEditPage';

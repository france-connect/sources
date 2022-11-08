import classnames from 'classnames';
import React from 'react';
import { useParams } from 'react-router-dom';

import { ServiceProviderHeaderComponent } from '../../../components';
import { ServiceProviderViewActionTypes } from '../../../enums';
import { useServiceProviderDetails } from '../../../hooks';
import styles from './service-provider-view.module.scss';

export const ServiceProviderViewPage = React.memo(() => {
  const { id } = useParams() as { id: string };
  const { item } = useServiceProviderDetails({
    id,
    type: ServiceProviderViewActionTypes.SERVICE_PROVIDER_VIEW_REQUESTED,
  });

  return (
    <div>
      {item && (
        <div className="fr-container fr-mt-3w">
          <ServiceProviderHeaderComponent item={item} />
          <div className={classnames('fr-text--sm fr-text--bold is-uppercase', styles.textDetail)}>
            Mode consultation
          </div>
        </div>
      )}
    </div>
  );
});

ServiceProviderViewPage.displayName = 'ServiceProviderViewPage';

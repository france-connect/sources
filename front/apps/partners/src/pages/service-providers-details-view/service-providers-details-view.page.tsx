import classnames from 'classnames';
import React from 'react';
import { useParams } from 'react-router-dom';

import { ServiceProviderViewActionTypes } from '@fc/service-providers';

import { ServiceProvidersDetailsHeaderComponent } from '../../components';
import { useServiceProviderDetails } from '../../hooks';
import styles from './service-providers-details-view.module.scss';

export const ServiceProvidersDetailsViewPage = React.memo(() => {
  const { id } = useParams() as { id: string };
  const { item } = useServiceProviderDetails({
    id,
    type: ServiceProviderViewActionTypes.SERVICE_PROVIDER_VIEW_REQUESTED,
  });

  return (
    <div>
      {item && (
        <div className="fr-container fr-mt-3w">
          <ServiceProvidersDetailsHeaderComponent item={item} />
          <div className={classnames('fr-text--sm fr-text--bold is-uppercase', styles.textDetail)}>
            Mode consultation
          </div>
        </div>
      )}
    </div>
  );
});

ServiceProvidersDetailsViewPage.displayName = 'ServiceProvidersDetailsViewPage';

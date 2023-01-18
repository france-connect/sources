import classnames from 'classnames';
import React from 'react';

import styles from '../../components/service-provider-sandbox/service-provider-sandbox.module.scss';
import { ServiceProviderConfigItem } from '../../interfaces';

export const transformServiceProviderConfig = (items: ServiceProviderConfigItem[]) => {
  try {
    return items.map((item: ServiceProviderConfigItem) => ({
      ...item,
      className: classnames('fr-mb-2w accordion-shadow-bottom', styles.accordion),
      element: React.createElement('div'),
      headingClassname: 'fr-px-2w fr-px-md-0',
      titleClassname: styles.accordionTitle,
    }));
  } catch (err) {
    throw new Error('Unable to parse items');
  }
};

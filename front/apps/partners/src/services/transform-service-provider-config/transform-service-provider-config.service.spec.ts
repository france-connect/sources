import React from 'react';

import styles from '../../components/service-provider-sandbox/service-provider-sandbox.module.scss';
import { ServiceProviderConfigItem } from '../../interfaces';
import { transformServiceProviderConfig } from './transform-service-provider-config.service';

describe('transformServiceProviderConfig', () => {
  const transformedItemsMock = [
    {
      className: 'fr-mb-2w accordion-shadow-bottom accordion',
      element: React.createElement('div'),
      headingClassname: 'fr-px-2w fr-px-md-0',
      id: 'any-config-id-1',
      title: 'Configuration de test N°1',
      titleClassname: styles.accordionTitle,
    },
    {
      className: 'fr-mb-2w accordion-shadow-bottom accordion',
      element: React.createElement('div'),
      headingClassname: 'fr-px-2w fr-px-md-0',
      id: 'any-config-id-2',
      title: 'Configuration de test N°2',
      titleClassname: styles.accordionTitle,
    },
  ];
  const itemsMock = [
    {
      id: 'any-config-id-1',
      title: 'Configuration de test N°1',
    },
    {
      id: 'any-config-id-2',
      title: 'Configuration de test N°2',
    },
  ];

  it('should return a transformed service provider configuration', () => {
    // when
    const result = transformServiceProviderConfig(itemsMock);

    // then
    expect(result).toStrictEqual(transformedItemsMock);
  });

  it('should throw an error when items is undefined', () => {
    // given
    const undefinedItems = undefined as unknown as ServiceProviderConfigItem[];

    // when

    expect(() => {
      transformServiceProviderConfig(undefinedItems);

      // then
    }).toThrow('Unable to parse items');
  });
});

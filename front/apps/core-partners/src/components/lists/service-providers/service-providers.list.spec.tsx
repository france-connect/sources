import { render } from '@testing-library/react';

import type { ISODate, UUIDType } from '@fc/common';
import { sortByKey, SortOrder } from '@fc/common';

import { ServiceProviderCardComponent } from '../../cards';
import { ServiceProvidersListComponent } from './service-providers.list';

jest.mock('../../cards/service-provider/service-provider.card');

describe('ServiceProvidersListComponent', () => {
  // Given
  const instanceItemsMock = [
    {
      createdAt: 'any-createdAt-mock-1' as unknown as ISODate,
      datapassRequestId: 'any-datapassRequestId-mock-1',
      datapassScopes: ['Identifiant technique'],
      id: '1',
      name: 'any-name-mock-1',
      organisation: {
        createdAt: 'any-org-createdAt-mock-1' as unknown as ISODate,
        id: 'org-id-1' as unknown as UUIDType,
        name: 'any-organisation-name-mock-1',
        serviceProviders: [],
        updatedAt: 'any-org-updatedAt-mock-1' as unknown as ISODate,
      },
      organizationName: 'any-organizationName-mock-1',
      platform: {
        id: 'platform-id-1' as unknown as UUIDType,
        name: 'any-platform-name-mock-1',
      },
      updatedAt: 'any-updatedAt-mock-1' as unknown as ISODate,
    },
    {
      createdAt: 'any-createdAt-mock-2' as unknown as ISODate,
      datapassRequestId: 'any-datapassRequestId-mock-2',
      datapassScopes: ['Identifiant technique'],
      id: '2',
      name: 'any-name-mock-2',
      organisation: {
        createdAt: 'any-org-createdAt-mock-2' as unknown as ISODate,
        id: 'org-id-2' as unknown as UUIDType,
        name: 'any-organisation-name-mock-2',
        serviceProviders: [],
        updatedAt: 'any-org-updatedAt-mock-2' as unknown as ISODate,
      },
      organizationName: 'any-organizationName-mock-2',
      platform: {
        id: 'platform-id-2' as unknown as UUIDType,
        name: 'any-platform-name-mock-2',
      },
      updatedAt: 'any-updatedAt-mock-2' as unknown as ISODate,
    },
    {
      createdAt: 'any-createdAt-mock-3' as unknown as ISODate,
      datapassRequestId: 'any-datapassRequestId-mock-3',
      datapassScopes: ['Identifiant technique'],
      id: '3',
      name: 'any-name-mock-3',
      organisation: {
        createdAt: 'any-org-createdAt-mock-3' as unknown as ISODate,
        id: 'org-id-3' as unknown as UUIDType,
        name: 'any-organisation-name-mock-3',
        serviceProviders: [],
        updatedAt: 'any-org-updatedAt-mock-3' as unknown as ISODate,
      },
      organizationName: 'any-organizationName-mock-3',
      platform: {
        id: 'platform-id-3' as unknown as UUIDType,
        name: 'any-platform-name-mock-3',
      },
      updatedAt: 'any-updatedAt-mock-3' as unknown as ISODate,
    },
  ];

  it('should match snapshot while calling the sortByKey util', () => {
    // When
    const { container } = render(<ServiceProvidersListComponent items={instanceItemsMock} />);

    // Then
    expect(container).toMatchSnapshot();
    expect(ServiceProviderCardComponent).toHaveBeenCalledTimes(3);
    expect(ServiceProviderCardComponent).toHaveBeenNthCalledWith(
      1,
      {
        className: undefined,
        data: instanceItemsMock[0],
      },
      undefined,
    );
    expect(ServiceProviderCardComponent).toHaveBeenNthCalledWith(
      2,
      {
        className: 'fr-mt-2w',
        data: instanceItemsMock[1],
      },
      undefined,
    );
    expect(ServiceProviderCardComponent).toHaveBeenNthCalledWith(
      3,
      {
        className: 'fr-mt-2w',
        data: instanceItemsMock[2],
      },
      undefined,
    );
    expect(sortByKey).toHaveBeenCalledOnce();
    expect(sortByKey).toHaveBeenCalledWith('updatedAt', SortOrder.DESC);
  });
});

import { render } from '@testing-library/react';

import type { ISODate } from '@fc/common';

import type { Environment } from '../../enums';
import { InstanceComponent } from '../instance/instance.component';
import { InstancesListComponent } from './instances.list';

jest.mock('../instance/instance.component');

describe('InstancesListComponent', () => {
  // Given
  const instanceItemsMock = [
    {
      createdAt: 'any-createdAt-mock-1' as unknown as ISODate,
      environment: 'SANDBOX' as unknown as Environment,
      id: '1',
      name: 'name',
      updatedAt: 'any-updatedAt-mock-1' as unknown as ISODate,
      versions: [expect.any(Object), expect.any(Object), expect.any(Object)],
    },
    {
      createdAt: 'any-createdAt-mock-2' as unknown as ISODate,
      environment: 'SANDBOX' as unknown as Environment,
      id: '2',
      name: 'name',
      updatedAt: 'any-updatedAt-mock-2' as unknown as ISODate,
      versions: [expect.any(Object), expect.any(Object), expect.any(Object)],
    },
    {
      createdAt: 'any-createdAt-mock-3' as unknown as ISODate,
      environment: 'SANDBOX' as unknown as Environment,
      id: '3',
      name: 'name',
      updatedAt: 'any-updatedAt-mock-3' as unknown as ISODate,
      versions: [expect.any(Object), expect.any(Object), expect.any(Object)],
    },
  ];

  it('should match snapshot', () => {
    // When
    const { container } = render(<InstancesListComponent items={instanceItemsMock} />);

    // Then
    expect(container).toMatchSnapshot();
    expect(InstanceComponent).toHaveBeenCalledTimes(3);
    expect(InstanceComponent).toHaveBeenNthCalledWith(1, { item: instanceItemsMock[0] }, {});
    expect(InstanceComponent).toHaveBeenNthCalledWith(2, { item: instanceItemsMock[1] }, {});
    expect(InstanceComponent).toHaveBeenNthCalledWith(3, { item: instanceItemsMock[2] }, {});
  });
});

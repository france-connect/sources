import { render } from '@testing-library/react';

import type { Environment, ISODate } from '@fc/common';
import { sortByKey, SortOrder } from '@fc/common';
import type { VersionInterface } from '@fc/partners-service-providers';

import { InstanceCardComponent } from '../../cards';
import { InstancesListComponent } from './instances.list';

jest.mock('../../cards/instance/instance.card');

describe('InstancesListComponent', () => {
  // Given
  const instanceItemsMock = [
    {
      createdAt: 'any-createdAt-mock-1' as unknown as ISODate,
      environment: 'SANDBOX' as unknown as Environment,
      id: '1',
      updatedAt: 'any-updatedAt-mock-1' as unknown as ISODate,
      versions: [
        {
          data: {
            // @NOTE API interface
            // eslint-disable-next-line @typescript-eslint/naming-convention
            client_id: 'any-client_id-mock-1',
            // @NOTE API interface
            // eslint-disable-next-line @typescript-eslint/naming-convention
            client_secret: 'any-client_secret-mock-1',
            name: 'any-name-mock-1',
          },
        } as unknown as VersionInterface,
      ],
    },
    {
      createdAt: 'any-createdAt-mock-2' as unknown as ISODate,
      environment: 'SANDBOX' as unknown as Environment,
      id: '2',
      updatedAt: 'any-updatedAt-mock-2' as unknown as ISODate,
      versions: [
        {
          data: {
            // @NOTE API interface
            // eslint-disable-next-line @typescript-eslint/naming-convention
            client_id: 'any-client_id-mock-2',
            // @NOTE API interface
            // eslint-disable-next-line @typescript-eslint/naming-convention
            client_secret: 'any-client_secret-mock-2',
            name: 'any-name-mock-2',
          },
        } as unknown as VersionInterface,
      ],
    },
    {
      createdAt: 'any-createdAt-mock-3' as unknown as ISODate,
      environment: 'SANDBOX' as unknown as Environment,
      id: '3',
      updatedAt: 'any-updatedAt-mock-3' as unknown as ISODate,
      versions: [
        {
          data: {
            // @NOTE API interface
            // eslint-disable-next-line @typescript-eslint/naming-convention
            client_id: 'any-client_id-mock-3',
            // @NOTE API interface
            // eslint-disable-next-line @typescript-eslint/naming-convention
            client_secret: 'any-client_secret-mock-3',
            name: 'any-name-mock-3',
          },
        } as unknown as VersionInterface,
      ],
    },
  ];

  it('should match snapshot while calling the sortByKey util', () => {
    // When
    const { container } = render(<InstancesListComponent items={instanceItemsMock} />);

    // Then
    expect(container).toMatchSnapshot();
    expect(InstanceCardComponent).toHaveBeenCalledTimes(3);
    expect(InstanceCardComponent).toHaveBeenNthCalledWith(
      1,
      {
        className: undefined,
        data: instanceItemsMock[0],
      },
      undefined,
    );
    expect(InstanceCardComponent).toHaveBeenNthCalledWith(
      2,
      {
        className: 'fr-mt-2w',
        data: instanceItemsMock[1],
      },
      undefined,
    );
    expect(InstanceCardComponent).toHaveBeenNthCalledWith(
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

import { render } from '@testing-library/react';

import { type ISODate, sortByKey, SortOrder } from '@fc/common';

import type { Environment } from '../../enums';
import type { VersionInterface } from '../../interfaces';
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
    expect(InstanceComponent).toHaveBeenCalledTimes(3);
    expect(InstanceComponent).toHaveBeenNthCalledWith(
      1,
      {
        className: undefined,
        createdAt: 'any-createdAt-mock-1',
        data: {
          // @NOTE API interface
          // eslint-disable-next-line @typescript-eslint/naming-convention
          client_id: 'any-client_id-mock-1',
          // @NOTE API interface
          // eslint-disable-next-line @typescript-eslint/naming-convention
          client_secret: 'any-client_secret-mock-1',
          name: 'any-name-mock-1',
        },
        id: '1',
      },
      {},
    );
    expect(InstanceComponent).toHaveBeenNthCalledWith(
      2,
      {
        className: 'fr-mt-2w',
        createdAt: 'any-createdAt-mock-2',
        data: {
          // @NOTE API interface
          // eslint-disable-next-line @typescript-eslint/naming-convention
          client_id: 'any-client_id-mock-2',
          // @NOTE API interface
          // eslint-disable-next-line @typescript-eslint/naming-convention
          client_secret: 'any-client_secret-mock-2',
          name: 'any-name-mock-2',
        },
        id: '2',
      },
      {},
    );
    expect(InstanceComponent).toHaveBeenNthCalledWith(
      3,
      {
        className: 'fr-mt-2w',
        createdAt: 'any-createdAt-mock-3',
        data: {
          // @NOTE API interface
          // eslint-disable-next-line @typescript-eslint/naming-convention
          client_id: 'any-client_id-mock-3',
          // @NOTE API interface
          // eslint-disable-next-line @typescript-eslint/naming-convention
          client_secret: 'any-client_secret-mock-3',
          name: 'any-name-mock-3',
        },
        id: '3',
      },
      {},
    );
    expect(sortByKey).toHaveBeenCalledOnce();
    expect(sortByKey).toHaveBeenCalledWith('updatedAt', SortOrder.DESC);
  });
});

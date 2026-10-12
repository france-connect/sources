import { render } from '@testing-library/react';

import type { ISODate, SelectableInterface } from '@fc/common';
import { formatCellValue, TableComponent } from '@fc/dsfr';

import { PartnersEnvironment } from '../../../enums';
import { formatClientId, formatCreatedAt } from '../../../formatters';
import type { InstanceInterface } from '../../../interfaces';
import { ServiceProviderLinkInstancesTable } from './service-provider-link-instances.table';

jest.mock('../../../formatters/client-id/client-id.formatter');
jest.mock('../../../formatters/created-at/created-at.formatter');

describe('ServiceProviderLinkInstancesTable', () => {
  // Given
  const sourcesMock: InstanceInterface[] = [
    {
      createdAt: '2024-01-15T10:00:00.000Z' as ISODate,
      currentVersion: {
        createdAt: '2024-01-15T10:00:00.000Z' as ISODate,
        data: {
          // eslint-disable-next-line @typescript-eslint/naming-convention -- API payload uses client_id
          client_id: 'a1b2c3d4e5f67890abcdef1234567890',
          name: 'Sandbox 1',
          signupId: '5555',
        },
        id: 'version-1',
        publicationStatus: 'DRAFT' as never,
        updatedAt: '2024-01-15T10:00:00.000Z' as ISODate,
      },
      environment: PartnersEnvironment.SANDBOX,
      id: 'instance-1',
      updatedAt: '2024-01-15T10:00:00.000Z' as ISODate,
    },
  ];

  const selectableMock: SelectableInterface<InstanceInterface> = {
    checkIfItemIsSelected: jest.fn(() => false),
    isAllItemsSelected: false,
    selection: new Set(),
    toggleAllItems: jest.fn(),
    toggleOneItem: jest.fn(),
  };

  it('should match snapshot', () => {
    // When
    const { container } = render(
      <ServiceProviderLinkInstancesTable selectable={selectableMock} sources={sourcesMock} />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render TableComponent with params', () => {
    // When
    render(<ServiceProviderLinkInstancesTable selectable={selectableMock} sources={sourcesMock} />);

    // Then
    expect(TableComponent).toHaveBeenCalledExactlyOnceWith(
      {
        columns: [
          {
            className: 'fr-text--bold',
            key: 'currentVersion.data.name',
            label: 'CorePartners.linkInstances.columns.instanceName',
          },
          {
            format: formatClientId,
            key: 'currentVersion.data.client_id',
            label: 'CorePartners.linkInstances.columns.clientId',
          },
          {
            format: formatCellValue,
            key: 'currentVersion.data.signupId',
            label: 'CorePartners.linkInstances.columns.datapassRequestId',
          },
          {
            format: formatCreatedAt,
            key: 'createdAt',
            label: 'CorePartners.linkInstances.columns.createdAt',
          },
        ],
        id: 'service-provider-link-instances',
        multiline: true,
        selectable: selectableMock,
        sources: sourcesMock,
        toolbar: { selectAll: true },
      },
      undefined,
    );
  });
});

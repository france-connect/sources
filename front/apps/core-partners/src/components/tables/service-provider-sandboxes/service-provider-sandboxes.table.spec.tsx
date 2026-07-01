import { render } from '@testing-library/react';

import type { ISODate } from '@fc/common';
import { getFullName, isoToDate, PublicationStatus, truncateMiddle } from '@fc/common';
import { TableComponent } from '@fc/dsfr';

import { PartnersEnvironment } from '../../../enums';
import { ServiceProviderSandboxesTable } from './service-provider-sandboxes.table';

describe('ServiceProviderSandboxesTable', () => {
  // Given
  const sandboxesMock = [
    {
      createdAt: '2024-01-15T10:00:00.000Z' as ISODate,
      creator: {
        email: 'john.doe@example.com',
        firstname: 'John',
        id: 'creator-1',
        lastname: 'Doe',
      },
      currentVersion: {
        createdAt: '2024-01-15T10:00:00.000Z' as ISODate,
        data: {
          // eslint-disable-next-line @typescript-eslint/naming-convention -- API payload uses client_id
          client_id: 'a1b2c3d4e5f67890abcdef1234567890',
          name: 'Sandbox 1',
        },
        id: 'version-1',
        publicationStatus: PublicationStatus.DRAFT,
        updatedAt: '2024-01-15T10:00:00.000Z' as ISODate,
      },
      environment: PartnersEnvironment.SANDBOX,
      id: 'sandbox-1',
      name: 'Sandbox 1',
      updatedAt: '2024-01-15T10:00:00.000Z' as ISODate,
    },
  ];

  const getTableColumns = () => jest.mocked(TableComponent).mock.calls[0][0].columns;

  it('should match snapshot', () => {
    // When
    const { container } = render(<ServiceProviderSandboxesTable sandboxes={sandboxesMock} />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render TableComponent with params', () => {
    // When
    render(<ServiceProviderSandboxesTable sandboxes={sandboxesMock} />);

    // Then
    expect(TableComponent).toHaveBeenCalledExactlyOnceWith(
      {
        columns: [
          {
            key: 'currentVersion.data.name',
            label: 'Partners.serviceProviderPage.sandboxes.columns.instanceName',
            styles: 'fr-text--bold',
          },
          {
            getValue: expect.any(Function),
            label: 'Partners.serviceProviderPage.sandboxes.columns.createdBy',
          },
          {
            format: expect.any(Function),
            key: 'currentVersion.data.client_id',
            label: 'Partners.serviceProviderPage.sandboxes.columns.clientId',
          },
          {
            format: expect.any(Function),
            key: 'createdAt',
            label: 'Partners.serviceProviderPage.sandboxes.columns.createdAt',
          },
        ],
        id: 'service-provider-sandboxes-table',
        multiline: true,
        sources: sandboxesMock,
      },
      undefined,
    );
  });

  it('should call truncateMiddle with sandbox client_id', () => {
    // Given
    const sandboxes = [{ ...sandboxesMock[0], id: 'sandbox-truncate' }];

    // When
    render(<ServiceProviderSandboxesTable sandboxes={sandboxes} />);
    const clientIdColumn = getTableColumns()?.[2];
    clientIdColumn?.format!('a1b2c3d4e5f67890abcdef1234567890');

    // Then
    expect(truncateMiddle).toHaveBeenCalledWith('a1b2c3d4e5f67890abcdef1234567890');
  });

  it('should display creator full name in table', () => {
    // Given
    const sandbox = { ...sandboxesMock[0], id: 'sandbox-creator' };

    // When
    render(<ServiceProviderSandboxesTable sandboxes={[sandbox]} />);
    const createdByColumn = getTableColumns()?.[1];
    createdByColumn?.getValue!(sandbox);

    // Then
    expect(getFullName).toHaveBeenCalledWith('John', 'Doe');
  });

  it('should call getFullName with undefined names when creator is undefined', () => {
    // Given
    const sandbox = { ...sandboxesMock[0], creator: undefined, id: 'sandbox-no-creator' };

    // When
    render(<ServiceProviderSandboxesTable sandboxes={[sandbox]} />);
    const createdByColumn = getTableColumns()?.[1];
    createdByColumn?.getValue!(sandbox);

    // Then
    expect(getFullName).toHaveBeenCalledWith(undefined, undefined);
  });

  it('should call isoToDate with sandbox createdAt', () => {
    // Given
    const sandboxes = [{ ...sandboxesMock[0], id: 'sandbox-created-at' }];

    // When
    render(<ServiceProviderSandboxesTable sandboxes={sandboxes} />);
    const createdAtColumn = getTableColumns()?.[3];
    createdAtColumn?.format!('2024-01-15T10:00:00.000Z' as ISODate);

    // Then
    expect(isoToDate).toHaveBeenCalledWith('2024-01-15T10:00:00.000Z');
  });

  it('should pass sandbox instance name in table sources', () => {
    // When
    render(
      <ServiceProviderSandboxesTable sandboxes={[{ ...sandboxesMock[0], id: 'sandbox-name' }]} />,
    );

    // Then
    const tableSources = jest.mocked(TableComponent).mock.calls[0][0].sources;

    expect(tableSources[0]).toMatchObject({
      id: 'sandbox-name',
      name: 'Sandbox 1',
    });
  });
});

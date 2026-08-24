import { render } from '@testing-library/react';

import type { ISODate } from '@fc/common';
import { getFullName, isoToDate, PublicationStatus, truncateMiddle } from '@fc/common';
import type { TableColumnActionsInterface, TableColumnInterface } from '@fc/dsfr';
import { TableComponent } from '@fc/dsfr';

import { PartnersEnvironment } from '../../../enums';
import type { InstanceInterface } from '../../../interfaces';
import { DeleteInstanceButton } from '../../buttons';
import { ServiceProviderSandboxesTable } from './service-provider-sandboxes.table';

jest.mock('../../buttons/delete-instance/delete-instance.button');

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

  const onDeleteMock = jest.fn();

  type TableProps = {
    actions?: TableColumnActionsInterface<InstanceInterface>;
    columns?: TableColumnInterface<InstanceInterface>[];
    sources?: InstanceInterface[];
  };

  const renderTable = (sandboxes: InstanceInterface[] = sandboxesMock) => {
    let tableProps = {} as TableProps;

    jest.mocked(TableComponent).mockImplementationOnce((props) => {
      tableProps = props as TableProps;
      return <div>TableComponent</div>;
    });

    render(<ServiceProviderSandboxesTable sandboxes={sandboxes} onDelete={onDeleteMock} />);

    return tableProps;
  };

  it('should match snapshot', () => {
    // When
    const { container } = render(
      <ServiceProviderSandboxesTable sandboxes={sandboxesMock} onDelete={onDeleteMock} />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render TableComponent with params', () => {
    // When
    render(<ServiceProviderSandboxesTable sandboxes={sandboxesMock} onDelete={onDeleteMock} />);

    // Then
    expect(TableComponent).toHaveBeenCalledExactlyOnceWith(
      {
        actions: expect.any(Function),
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

  it('should render a delete button for the row instance through the actions render prop', () => {
    // Given
    const { actions } = renderTable();

    // When
    render(<div>{actions?.(sandboxesMock[0], 0)}</div>);

    // Then
    expect(DeleteInstanceButton).toHaveBeenCalledExactlyOnceWith(
      {
        instance: sandboxesMock[0],
        onDelete: onDeleteMock,
      },
      undefined,
    );
  });

  it('should call truncateMiddle with sandbox client_id', () => {
    // Given
    const { columns } = renderTable([{ ...sandboxesMock[0], id: 'sandbox-truncate' }]);

    // When
    columns?.[2]?.format!('a1b2c3d4e5f67890abcdef1234567890');

    // Then
    expect(truncateMiddle).toHaveBeenCalledWith('a1b2c3d4e5f67890abcdef1234567890');
  });

  it('should display creator full name in table', () => {
    // Given
    const sandbox = { ...sandboxesMock[0], id: 'sandbox-creator' };
    const { columns } = renderTable([sandbox]);

    // When
    columns?.[1]?.getValue!(sandbox);

    // Then
    expect(getFullName).toHaveBeenCalledWith('John', 'Doe');
  });

  it('should call getFullName with undefined names when creator is undefined', () => {
    // Given
    const sandbox = { ...sandboxesMock[0], creator: undefined, id: 'sandbox-no-creator' };
    const { columns } = renderTable([sandbox]);

    // When
    columns?.[1]?.getValue!(sandbox);

    // Then
    expect(getFullName).toHaveBeenCalledWith(undefined, undefined);
  });

  it('should call isoToDate with sandbox createdAt', () => {
    // Given
    const { columns } = renderTable([{ ...sandboxesMock[0], id: 'sandbox-created-at' }]);

    // When
    columns?.[3]?.format!('2024-01-15T10:00:00.000Z' as ISODate);

    // Then
    expect(isoToDate).toHaveBeenCalledWith('2024-01-15T10:00:00.000Z');
  });

  it('should pass sandbox instance name in table sources', () => {
    // When
    const { sources } = renderTable([{ ...sandboxesMock[0], id: 'sandbox-name' }]);

    // Then
    expect(sources?.[0]).toMatchObject({
      id: 'sandbox-name',
      name: 'Sandbox 1',
    });
  });
});

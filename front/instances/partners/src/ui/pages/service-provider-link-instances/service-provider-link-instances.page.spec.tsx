import { fireEvent, render, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import { ButtonTypes, SimpleButton, TableComponent } from '@fc/dsfr';

import { useLinkableInstancesToServiceProvider } from '../../../hooks/service-provider-link-instances';
import { ServiceProviderLinkInstancesPage } from './service-provider-link-instances.page';

// @NOTE should be removed
// react-final-form should only be mocked from __mocks__ folder
// and not being mocked or modified by any TU file
jest.unmock('react-final-form');

jest.mock('../../../hooks/service-provider-link-instances/service-provider-link-instances.hook');

describe('ServiceProviderLinkInstancesPage', () => {
  // Given
  const handleCancelMock = jest.fn();
  const handleSubmitMock = jest.fn().mockResolvedValue(undefined);
  const validateHandlerMock = jest.fn().mockReturnValue(undefined);

  const defaultUnlinkedInstances = [
    {
      createdAt: '2024-01-01T00:00:00.000Z',
      currentVersion: {
        data: {
          // eslint-disable-next-line @typescript-eslint/naming-convention -- API payload uses client_id
          client_id: '12345678901234567890',
          name: 'Sandbox 1',
          signupId: '5555',
        },
      },
      environment: 'SANDBOX',
      id: 'instance-id-1',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
  ];

  beforeEach(() => {
    // Given
    jest.mocked(TableComponent).mockImplementation(({ sources }) => {
      const rows = sources as unknown as { clientId: string; name: ReactNode }[];
      return (
        <div data-testid="link-instances-table-mock">
          {rows.map((source, idx) => {
            const key = `row-${idx}`;
            return <div key={key}>{source.name}</div>;
          })}
        </div>
      );
    });
    jest.mocked(useLinkableInstancesToServiceProvider).mockReturnValue({
      handleCancel: handleCancelMock,
      handleSubmit: handleSubmitMock,
      initialValues: { instances: {} },
      linkableInstances: defaultUnlinkedInstances,
      serviceProviderName:
        "Formulaire d'accès à l'administration numérique pour les étrangers en France",
      validateHandler: validateHandlerMock,
    } as never);
  });

  it('should match snapshot', () => {
    // When
    const { container } = render(<ServiceProviderLinkInstancesPage />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render link instances page', () => {
    // When
    const { getByText } = render(<ServiceProviderLinkInstancesPage />);

    // Then
    expect(getByText('Partners.linkInstances.title')).toBeInTheDocument();
    expect(
      getByText("Formulaire d'accès à l'administration numérique pour les étrangers en France"),
    ).toBeInTheDocument();
    expect(jest.mocked(SimpleButton)).toHaveBeenCalledWith(
      expect.objectContaining({
        children: 'Partners.linkInstances.submit',
        type: ButtonTypes.SUBMIT,
      }),
      undefined,
    );
    expect(jest.mocked(SimpleButton)).toHaveBeenCalledWith(
      expect.objectContaining({
        children: 'Partners.linkInstances.cancel',
        type: ButtonTypes.BUTTON,
      }),
      undefined,
    );
    expect(TableComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        columns: expect.arrayContaining([
          expect.objectContaining({
            key: 'signupId',
            label: 'Partners.linkInstances.columns.datapassRequestId',
          }),
        ]),
      }),
      undefined,
    );

    const tableSources = jest.mocked(TableComponent).mock.calls[0][0].sources as unknown as Array<{
      signupId: string;
    }>;

    expect(tableSources[0].signupId).toBe('5555');
  });

  it('should fallback to "-" when signupId is absent', () => {
    jest.mocked(useLinkableInstancesToServiceProvider).mockReturnValueOnce({
      handleCancel: handleCancelMock,
      handleSubmit: handleSubmitMock,
      initialValues: { instances: {} },
      linkableInstances: [
        {
          createdAt: '2024-01-01T00:00:00.000Z',
          currentVersion: {
            data: {
              // eslint-disable-next-line @typescript-eslint/naming-convention -- API payload uses client_id
              client_id: '12345678901234567890',
              name: 'Sandbox 1',
            },
          },
          environment: 'SANDBOX',
          id: 'instance-id-1',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ],
      serviceProviderName: 'Service Provider',
      validateHandler: validateHandlerMock,
    } as never);

    render(<ServiceProviderLinkInstancesPage />);

    const tableSources = jest.mocked(TableComponent).mock.calls[0][0].sources as unknown as Array<{
      signupId: string;
    }>;

    expect(tableSources[0].signupId).toBe('-');
  });

  it('should not call handleSubmit when validateHandler returns an error', async () => {
    // Given
    jest.mocked(useLinkableInstancesToServiceProvider).mockReturnValueOnce({
      handleCancel: handleCancelMock,
      handleSubmit: handleSubmitMock,
      initialValues: { instances: {} },
      linkableInstances: defaultUnlinkedInstances,
      serviceProviderName: 'Service Provider',
      validateHandler: jest.fn().mockReturnValueOnce({ instances: 'error' }),
    } as never);

    // When
    const { container } = render(<ServiceProviderLinkInstancesPage />);
    fireEvent.submit(container.querySelector('form')!);

    // Then
    await waitFor(() => {
      expect(handleSubmitMock).not.toHaveBeenCalled();
    });
  });

  it('should call handleSubmit when form is valid and submitted', async () => {
    // Given
    const { container } = render(<ServiceProviderLinkInstancesPage />);

    // When
    fireEvent.click(container.querySelector('#link-instances-select-all')!);
    fireEvent.submit(container.querySelector('form')!);

    // Then
    await waitFor(() => {
      expect(handleSubmitMock).toHaveBeenCalledOnce();
    });
  });

  it('should render without service provider name when absent', () => {
    jest.mocked(useLinkableInstancesToServiceProvider).mockReturnValueOnce({
      handleCancel: handleCancelMock,
      handleSubmit: handleSubmitMock,
      initialValues: { instances: {} },
      linkableInstances: [
        {
          createdAt: '2024-01-01T00:00:00.000Z',
          currentVersion: {
            data: {} as never,
          },
          environment: 'SANDBOX',
          id: 'instance-id-1',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ],
      serviceProviderName: undefined,
      validateHandler: validateHandlerMock,
    } as never);

    const { getByText, queryByText } = render(<ServiceProviderLinkInstancesPage />);

    expect(getByText('Partners.linkInstances.title')).toBeInTheDocument();
    expect(
      queryByText("Formulaire d'accès à l'administration numérique pour les étrangers en France"),
    ).not.toBeInTheDocument();
  });

  it('should call handleCancel when cancel button is clicked', () => {
    render(<ServiceProviderLinkInstancesPage />);

    const cancelCall = jest
      .mocked(SimpleButton)
      .mock.calls.find((call) => (call[0] as { type?: string }).type === ButtonTypes.BUTTON);

    expect(cancelCall).toBeDefined();

    (cancelCall![0] as { onClick?: () => void }).onClick?.();

    expect(handleCancelMock).toHaveBeenCalledOnce();
  });
});

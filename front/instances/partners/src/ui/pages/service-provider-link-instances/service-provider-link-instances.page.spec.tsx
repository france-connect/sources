import { render } from '@testing-library/react';

import {
  ServiceProviderLinkInstancesActionsComponent,
  ServiceProviderLinkInstancesPageHeaderComponent,
  ServiceProviderLinkInstancesTable,
} from '@fc/core-partners';

import { useLinkableInstancesToServiceProvider } from '../../../hooks/service-provider-link-instances';
import { ServiceProviderLinkInstancesPage } from './service-provider-link-instances.page';

jest.mock('../../../hooks/service-provider-link-instances/service-provider-link-instances.hook');

describe('ServiceProviderLinkInstancesPage', () => {
  // Given
  const handleCancelMock = jest.fn();
  const handleSubmitMock = jest.fn();
  const selectableMock = {
    checkIfItemIsSelected: jest.fn(),
    isAllItemsSelected: false,
    selection: new Set<string>(['instance-id-1']),
    toggleAllItems: jest.fn(),
    toggleOneItem: jest.fn(),
  };
  const linkableInstancesMock = [{ id: 'instance-id-1' }];

  beforeEach(() => {
    // Given
    jest.mocked(useLinkableInstancesToServiceProvider).mockReturnValue({
      canSubmit: true,
      handleCancel: handleCancelMock,
      handleSubmit: handleSubmitMock,
      linkableInstances: linkableInstancesMock,
      selectable: selectableMock,
      serviceProviderName: 'any-service-provider-name-mock',
    } as never);
  });

  it('should match snapshot', () => {
    // When
    const { container } = render(<ServiceProviderLinkInstancesPage />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render header, table and actions with hook values', () => {
    // When
    render(<ServiceProviderLinkInstancesPage />);

    // Then
    expect(ServiceProviderLinkInstancesPageHeaderComponent).toHaveBeenCalledExactlyOnceWith(
      {
        serviceProviderName: 'any-service-provider-name-mock',
      },
      undefined,
    );
    expect(ServiceProviderLinkInstancesTable).toHaveBeenCalledExactlyOnceWith(
      {
        selectable: selectableMock,
        sources: linkableInstancesMock,
      },
      undefined,
    );
    expect(ServiceProviderLinkInstancesActionsComponent).toHaveBeenCalledExactlyOnceWith(
      {
        canSubmit: true,
        onCancel: handleCancelMock,
        onSubmit: handleSubmitMock,
      },
      undefined,
    );
  });

  it('should pass canSubmit false to actions when submit is disabled', () => {
    // Given
    jest.mocked(useLinkableInstancesToServiceProvider).mockReturnValueOnce({
      canSubmit: false,
      handleCancel: handleCancelMock,
      handleSubmit: handleSubmitMock,
      linkableInstances: linkableInstancesMock,
      selectable: selectableMock,
      serviceProviderName: 'any-service-provider-name-mock',
    } as never);

    // When
    render(<ServiceProviderLinkInstancesPage />);

    // Then
    expect(ServiceProviderLinkInstancesActionsComponent).toHaveBeenCalledExactlyOnceWith(
      {
        canSubmit: false,
        onCancel: handleCancelMock,
        onSubmit: handleSubmitMock,
      },
      undefined,
    );
  });
});

import { render } from '@testing-library/react';

import type {
  ServiceProviderInterface,
  ServiceProviderPermissionInterface,
} from '@fc/core-partners';
import {
  ServiceProviderContributorsComponent,
  ServiceProviderDatapassComponent,
  ServiceProviderNameComponent,
  ServiceProviderSandboxesComponent,
  ServiceProviderScopesComponent,
} from '@fc/core-partners';

import serviceProviderFixture from '../../../__fixtures__/service-provider.fixture.json';
import serviceProviderPermissionsFixture from '../../../__fixtures__/service-provider-permissions.fixture.json';
import { useServiceProvider } from '../../../hooks';
import { ServiceProviderPage } from './service-provider.page';

jest.mock('../../../hooks/service-provider/service-provider.hook');

describe('ServiceProviderPage', () => {
  // Given
  const serviceProviderMock = serviceProviderFixture;
  const permissionsMock = serviceProviderPermissionsFixture;

  beforeEach(() => {
    // Given
    jest.mocked(useServiceProvider).mockReturnValue({
      permissions: permissionsMock as unknown as ServiceProviderPermissionInterface[],
      serviceProvider: serviceProviderMock as unknown as ServiceProviderInterface,
    });
  });

  it('should match snapshot', () => {
    // When
    const { container } = render(<ServiceProviderPage />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call useServiceProvider hook', () => {
    // When
    render(<ServiceProviderPage />);

    // Then
    expect(useServiceProvider).toHaveBeenCalledExactlyOnceWith();
  });

  it('should render ServiceProviderNameComponent with name and organizationName', () => {
    // When
    render(<ServiceProviderPage />);

    // Then
    expect(ServiceProviderNameComponent).toHaveBeenCalledExactlyOnceWith(
      {
        name: serviceProviderMock.name,
        organizationName: serviceProviderMock.organization.name,
      },
      undefined,
    );
  });

  it('should render ServiceProviderDatapassComponent with datapassRequestId', () => {
    // When
    render(<ServiceProviderPage />);

    // Then
    expect(ServiceProviderDatapassComponent).toHaveBeenCalledExactlyOnceWith(
      {
        datapassRequestId: serviceProviderMock.datapassRequestId,
      },
      undefined,
    );
  });

  it('should render ServiceProviderScopesComponent with scopes', () => {
    // When
    render(<ServiceProviderPage />);

    // Then
    expect(ServiceProviderScopesComponent).toHaveBeenCalledExactlyOnceWith(
      {
        datapassScopes: serviceProviderMock.datapassScopes,
        fcScopes: serviceProviderMock.fcScopes,
      },
      undefined,
    );
  });

  it('should render ServiceProviderContributorsComponent with permissions', () => {
    // When
    render(<ServiceProviderPage />);

    // Then
    expect(ServiceProviderContributorsComponent).toHaveBeenCalledExactlyOnceWith(
      {
        permissions: permissionsMock,
      },
      undefined,
    );
  });

  it('should render ServiceProviderSandboxesComponent with instances', () => {
    // When
    render(<ServiceProviderPage />);

    // Then
    expect(ServiceProviderSandboxesComponent).toHaveBeenCalledExactlyOnceWith(
      {
        instances: serviceProviderMock.instances,
      },
      undefined,
    );
  });
});

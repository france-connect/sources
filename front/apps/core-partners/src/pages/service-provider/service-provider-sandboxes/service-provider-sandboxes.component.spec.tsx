import { render } from '@testing-library/react';

import { MessageTypes } from '@fc/common';
import { AlertComponent, ButtonGroupComponent, LinkComponent } from '@fc/dsfr';
import { t } from '@fc/i18n';

import { CreateLinkedInstanceButton, LinkInstancesButton, SandboxAlert } from '../../../components';
import { ServiceProviderSandboxesTable } from '../../../components/tables';
import { useServiceProviderSandboxes } from '../../../hooks';
import type { InstanceInterface } from '../../../interfaces';
import { ServiceProviderSandboxesComponent } from './service-provider-sandboxes.component';

jest.mock('../../../components/buttons/link-instance/link-instance.button');
jest.mock('../../../components/buttons/create-linked-instance/create-linked-instance.button');
jest.mock('../../../components/alerts/sandbox/sandbox.alert');
jest.mock('../../../components/tables/service-provider-sandboxes/service-provider-sandboxes.table');
jest.mock('../../../hooks/service-provider-sandboxes/service-provider-sandboxes.hook');

describe('ServiceProviderSandboxesComponent', () => {
  // Given
  const spConfigurationDocUrlMock = 'https://example.com/sp-configuration-doc-mock';
  const instancesMock = [{ id: 'instance-mock' }] as InstanceInterface[];
  const emptyInstancesMock: InstanceInterface[] = [];

  const deleteInstanceHandlerMock = jest.fn();

  const defaultHookResultMock = {
    confirmDeleteInstance: jest.fn(),
    deleteInstanceHandler: deleteInstanceHandlerMock,
    hasUnlinkedInstances: false,
    spConfigurationDocUrl: spConfigurationDocUrlMock,
  };

  beforeEach(() => {
    // Given
    jest.mocked(useServiceProviderSandboxes).mockReturnValue(defaultHookResultMock);
  });

  it('should match the snapshot', () => {
    // When
    const { container } = render(<ServiceProviderSandboxesComponent instances={instancesMock} />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call useServiceProviderSandboxes hook', () => {
    // When
    render(<ServiceProviderSandboxesComponent instances={instancesMock} />);

    // Then
    expect(useServiceProviderSandboxes).toHaveBeenCalledExactlyOnceWith();
  });

  it('should render the title', () => {
    // When
    render(<ServiceProviderSandboxesComponent instances={instancesMock} />);

    // Then
    expect(t).toHaveBeenCalledWith('Partners.serviceProviderPage.sandboxes.title');
  });

  it('should render SandboxAlert', () => {
    // When
    render(<ServiceProviderSandboxesComponent instances={instancesMock} />);

    // Then
    expect(SandboxAlert).toHaveBeenCalledExactlyOnceWith({}, undefined);
  });

  it('should render LinkComponent with spConfigurationDocUrl', () => {
    // When
    render(<ServiceProviderSandboxesComponent instances={instancesMock} />);

    // Then
    expect(LinkComponent).toHaveBeenCalledExactlyOnceWith(
      {
        children: 'Partners.serviceProviderPage.sandboxes.description.link',
        external: true,
        href: spConfigurationDocUrlMock,
      },
      undefined,
    );
  });

  it('should render ButtonGroupComponent with parameters', () => {
    // When
    render(<ServiceProviderSandboxesComponent instances={instancesMock} />);

    // Then
    expect(ButtonGroupComponent).toHaveBeenCalledExactlyOnceWith(
      {
        align: 'right',
        children: expect.anything(),
        iconPlacement: 'left',
      },
      undefined,
    );
  });

  it('should render CreateLinkedInstanceButton', () => {
    // When
    render(<ServiceProviderSandboxesComponent instances={instancesMock} />);

    // Then
    expect(CreateLinkedInstanceButton).toHaveBeenCalledExactlyOnceWith({}, undefined);
  });

  it('should render ServiceProviderSandboxesTable when sandboxes exist', () => {
    // When
    render(<ServiceProviderSandboxesComponent instances={instancesMock} />);

    // Then
    expect(ServiceProviderSandboxesTable).toHaveBeenCalledExactlyOnceWith(
      { onDelete: deleteInstanceHandlerMock, sandboxes: instancesMock },
      undefined,
    );
  });

  it('should render empty AlertComponent when no sandboxes exist', () => {
    // When
    render(<ServiceProviderSandboxesComponent instances={emptyInstancesMock} />);

    // Then
    expect(AlertComponent).toHaveBeenCalledExactlyOnceWith(
      {
        children: 'Partners.serviceProviderPage.sandboxes.empty',
        dataTestId: 'service-provider-sandboxes-empty-alert',
        type: MessageTypes.INFO,
      },
      undefined,
    );
    expect(ServiceProviderSandboxesTable).not.toHaveBeenCalled();
  });

  it('should render LinkInstancesButton when unlinked instances exist', () => {
    // Given
    jest.mocked(useServiceProviderSandboxes).mockReturnValueOnce({
      ...defaultHookResultMock,
      hasUnlinkedInstances: true,
    });

    // When
    render(<ServiceProviderSandboxesComponent instances={instancesMock} />);

    // Then
    expect(LinkInstancesButton).toHaveBeenCalledExactlyOnceWith({}, undefined);
  });

  it('should not render LinkInstancesButton when unlinked instances do not exist', () => {
    // When
    render(<ServiceProviderSandboxesComponent instances={instancesMock} />);

    // Then
    expect(LinkInstancesButton).not.toHaveBeenCalled();
  });
});

import { render } from '@testing-library/react';

import { t } from '@fc/i18n';
import { ModalShellComponent } from '@fc/modal';

import { DeleteInstanceModalComponent } from './delete-instance-modal.component';

describe('DeleteInstanceModalComponent', () => {
  // Given
  const onCloseMock = jest.fn();
  const onConfirmMock = jest.fn();

  const renderComponent = () =>
    render(
      <DeleteInstanceModalComponent
        id="delete-instance"
        instanceName="any-instance-name-mock"
        onClose={onCloseMock}
        onConfirm={onConfirmMock}
      />,
    );

  it('should match the snapshot', () => {
    // When
    const { container } = renderComponent();

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render the DSFR shell with the modal identifier and its title', () => {
    // When
    renderComponent();

    // Then
    expect(t).toHaveBeenCalledWith('Partners.serviceProviderPage.sandboxes.deleteModal.title');
    expect(ModalShellComponent).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        id: 'delete-instance',
        onClose: onCloseMock,
        onConfirm: onConfirmMock,
        title: 'Partners.serviceProviderPage.sandboxes.deleteModal.title',
      }),
      undefined,
    );
  });

  it('should name the instance into the description', () => {
    // When
    renderComponent();

    // Then
    expect(t).toHaveBeenCalledWith(
      'Partners.serviceProviderPage.sandboxes.deleteModal.description',
      { instanceName: 'any-instance-name-mock' },
    );
  });
});

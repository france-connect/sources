import { render } from '@testing-library/react';

import { t } from '@fc/i18n';
import { ModalShellComponent } from '@fc/modal';

import { DeleteContributorModalComponent } from './delete-contributor-modal.component';

describe('DeleteContributorModalComponent', () => {
  // Given
  const emailMock = 'jean.dupont@example.com';
  const onCloseMock = jest.fn();
  const onConfirmMock = jest.fn();

  const renderComponent = () =>
    render(
      <DeleteContributorModalComponent
        email={emailMock}
        id="delete-contributor"
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
    expect(t).toHaveBeenCalledWith('Partners.serviceProviderPage.usersSection.deleteModal.title');
    expect(ModalShellComponent).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        id: 'delete-contributor',
        onClose: onCloseMock,
        onConfirm: onConfirmMock,
        title: 'Partners.serviceProviderPage.usersSection.deleteModal.title',
      }),
      undefined,
    );
  });

  it('should name the contributor into the description', () => {
    // When
    renderComponent();

    // Then
    expect(t).toHaveBeenCalledWith(
      'Partners.serviceProviderPage.usersSection.deleteModal.description',
      { email: emailMock },
    );
  });
});

import { render } from '@testing-library/react';

import { Align, ButtonGroupComponent, ButtonTypes, Priorities, SimpleButton } from '@fc/dsfr';

import { useDeleteInstanceModalFooter } from '../../../hooks';
import { DeleteInstanceModalFooterComponent } from './delete-instance-modal-footer.component';

jest.mock('../../../hooks/delete-instance-modal-footer/delete-instance-modal-footer.hook');

describe('DeleteInstanceModalFooterComponent', () => {
  // Given
  const onCloseMock = jest.fn();
  const onConfirmMock = jest.fn();
  const handleConfirmMock = jest.fn();

  beforeEach(() => {
    // Given
    jest.mocked(useDeleteInstanceModalFooter).mockReturnValue({ handleConfirm: handleConfirmMock });
  });

  it('should match the snapshot', () => {
    // When
    const { container } = render(
      <DeleteInstanceModalFooterComponent onClose={onCloseMock} onConfirm={onConfirmMock} />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call useDeleteInstanceModalFooter with the modal callbacks', () => {
    // When
    render(<DeleteInstanceModalFooterComponent onClose={onCloseMock} onConfirm={onConfirmMock} />);

    // Then
    expect(useDeleteInstanceModalFooter).toHaveBeenCalledExactlyOnceWith({
      onClose: onCloseMock,
      onConfirm: onConfirmMock,
    });
  });

  it('should render the action buttons into a right aligned button group', () => {
    // When
    render(<DeleteInstanceModalFooterComponent onClose={onCloseMock} onConfirm={onConfirmMock} />);

    // Then
    expect(ButtonGroupComponent).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ align: Align.RIGHT }),
      undefined,
    );
  });

  it('should call SimpleButton 2 times with the cancel and confirm params', () => {
    // When
    render(<DeleteInstanceModalFooterComponent onClose={onCloseMock} onConfirm={onConfirmMock} />);

    // Then
    expect(SimpleButton).toHaveBeenCalledTimes(2);

    expect(SimpleButton).toHaveBeenNthCalledWith(
      1,
      {
        children: 'FC.Common.cancel',
        dataTestId: 'delete-instance-modal-cancel-button',
        onClick: onCloseMock,
        priority: Priorities.SECONDARY,
        type: ButtonTypes.BUTTON,
      },
      undefined,
    );

    expect(SimpleButton).toHaveBeenNthCalledWith(
      2,
      {
        children: 'Partners.serviceProviderPage.sandboxes.deleteModal.confirm',
        dataTestId: 'delete-instance-modal-confirm-button',
        onClick: handleConfirmMock,
        type: ButtonTypes.BUTTON,
      },
      undefined,
    );
  });
});

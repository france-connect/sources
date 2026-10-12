import { render } from '@testing-library/react';

import { Align, ButtonGroupComponent, ButtonTypes, Priorities, SimpleButton } from '@fc/dsfr';

import { useModalFooter } from '../../hooks';
import { ModalFooterComponent } from './modal-footer.component';

jest.mock('../../hooks/use-modal-footer/use-modal-footer.hook');

describe('ModalFooterComponent', () => {
  // Given
  const onCloseMock = jest.fn();
  const onConfirmMock = jest.fn();
  const handleConfirmMock = jest.fn();

  beforeEach(() => {
    // Given
    jest.mocked(useModalFooter).mockReturnValue({ handleConfirm: handleConfirmMock });
  });

  it('should match the snapshot', () => {
    // When
    const { container } = render(
      <ModalFooterComponent onClose={onCloseMock} onConfirm={onConfirmMock} />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render the buttons into a DSFR footer wrapper', () => {
    // When
    const { container } = render(
      <ModalFooterComponent onClose={onCloseMock} onConfirm={onConfirmMock} />,
    );

    // Then
    expect(container.firstChild).toHaveClass('fr-modal__footer');
  });

  it('should call useModalFooter with the modal callbacks', () => {
    // When
    render(<ModalFooterComponent onClose={onCloseMock} onConfirm={onConfirmMock} />);

    // Then
    expect(useModalFooter).toHaveBeenCalledExactlyOnceWith({
      onClose: onCloseMock,
      onConfirm: onConfirmMock,
    });
  });

  it('should render the action buttons into a right aligned button group', () => {
    // When
    render(<ModalFooterComponent onClose={onCloseMock} onConfirm={onConfirmMock} />);

    // Then
    expect(ButtonGroupComponent).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ align: Align.RIGHT }),
      undefined,
    );
  });

  it('should call SimpleButton 2 times with the cancel and confirm params', () => {
    // When
    render(<ModalFooterComponent onClose={onCloseMock} onConfirm={onConfirmMock} />);

    // Then
    expect(SimpleButton).toHaveBeenCalledTimes(2);

    expect(SimpleButton).toHaveBeenNthCalledWith(
      1,
      {
        children: 'FC.Common.cancel',
        dataTestId: 'modal-cancel-button',
        onClick: onCloseMock,
        priority: Priorities.SECONDARY,
        type: ButtonTypes.BUTTON,
      },
      undefined,
    );

    expect(SimpleButton).toHaveBeenNthCalledWith(
      2,
      {
        children: 'FC.Common.confirm',
        dataTestId: 'modal-confirm-button',
        onClick: handleConfirmMock,
        type: ButtonTypes.BUTTON,
      },
      undefined,
    );
  });
});

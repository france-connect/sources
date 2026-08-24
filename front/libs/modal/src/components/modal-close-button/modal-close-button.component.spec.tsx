import { fireEvent, render } from '@testing-library/react';

import { t } from '@fc/i18n';

import { ModalCloseButtonComponent } from './modal-close-button.component';

describe('ModalCloseButtonComponent', () => {
  it('should match the snapshot', () => {
    // Given
    jest
      .mocked(t)
      .mockReturnValueOnce('FC.Common.close.mock_value')
      .mockReturnValueOnce('FC.Common.close.mock_value');

    // When
    const { container } = render(
      <ModalCloseButtonComponent id="any-modal-id-mock" onClose={jest.fn()} />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render a DSFR close button labelled with the i18n translation', () => {
    // Given
    jest
      .mocked(t)
      .mockReturnValueOnce('any-close-title-mock')
      .mockReturnValueOnce('any-close-label-mock');

    // When
    const { getByTestId } = render(
      <ModalCloseButtonComponent id="any-modal-id-mock" onClose={jest.fn()} />,
    );

    // Then
    const element = getByTestId('any-modal-id-mock-close-button');

    expect(t).toHaveBeenCalledWith('FC.Common.close');
    expect(element).toHaveClass('fr-btn--close', 'fr-btn');
    expect(element).toHaveAttribute('type', 'button');
    expect(element).toHaveAttribute('aria-controls', 'any-modal-id-mock');
    expect(element).toHaveAttribute('title', 'any-close-title-mock');
    expect(element).toHaveTextContent('any-close-label-mock');
  });

  it('should call onClose when the button is clicked', () => {
    // Given
    const onCloseMock = jest.fn();

    // When
    const { getByTestId } = render(
      <ModalCloseButtonComponent id="any-modal-id-mock" onClose={onCloseMock} />,
    );
    fireEvent.click(getByTestId('any-modal-id-mock-close-button'));

    // Then
    expect(onCloseMock).toHaveBeenCalledOnce();
  });
});

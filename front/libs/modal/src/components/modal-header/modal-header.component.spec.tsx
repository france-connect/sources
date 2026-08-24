import { render } from '@testing-library/react';

import { ModalCloseButtonComponent } from '../modal-close-button';
import { ModalHeaderComponent } from './modal-header.component';

jest.mock('../modal-close-button/modal-close-button.component');

describe('ModalHeaderComponent', () => {
  it('should match the snapshot', () => {
    // When
    const { container } = render(
      <ModalHeaderComponent id="any-modal-id-mock" onClose={jest.fn()} />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render the close button into a DSFR header wrapper', () => {
    // Given
    const onCloseMock = jest.fn();

    // When
    const { container } = render(
      <ModalHeaderComponent id="any-modal-id-mock" onClose={onCloseMock} />,
    );

    // Then
    expect(container.firstChild).toHaveClass('fr-modal__header');
    expect(ModalCloseButtonComponent).toHaveBeenCalledOnce();
    expect(ModalCloseButtonComponent).toHaveBeenCalledWith(
      { id: 'any-modal-id-mock', onClose: onCloseMock },
      undefined,
    );
  });
});

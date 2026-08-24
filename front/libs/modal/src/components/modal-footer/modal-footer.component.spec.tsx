import { render } from '@testing-library/react';

import { ModalFooterComponent } from './modal-footer.component';

describe('ModalFooterComponent', () => {
  it('should match the snapshot', () => {
    // When
    const { container } = render(
      <ModalFooterComponent>
        <button type="button">any-action-mock</button>
      </ModalFooterComponent>,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render the children into a DSFR footer wrapper', () => {
    // When
    const { container, getByText } = render(
      <ModalFooterComponent>
        <button type="button">any-action-mock</button>
      </ModalFooterComponent>,
    );

    // Then
    expect(container.firstChild).toHaveClass('fr-modal__footer');
    expect(getByText('any-action-mock')).toBeInTheDocument();
  });
});

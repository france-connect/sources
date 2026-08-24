import { render } from '@testing-library/react';

import { HeadingTag } from '@fc/common';

import { ModalTitleComponent } from './modal-title.component';

describe('ModalTitleComponent', () => {
  it('should match the snapshot', () => {
    // When
    const { container } = render(
      <ModalTitleComponent heading={HeadingTag.H1} id="any-modal-id-mock-title">
        any-title-mock
      </ModalTitleComponent>,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render a DSFR title with the given heading tag and id', () => {
    // When
    const { getByRole } = render(
      <ModalTitleComponent heading={HeadingTag.H2} id="any-modal-id-mock-title">
        any-title-mock
      </ModalTitleComponent>,
    );

    // Then
    const element = getByRole('heading', { level: 2, name: 'any-title-mock' });

    expect(element).toHaveClass('fr-modal__title');
    expect(element).toHaveAttribute('id', 'any-modal-id-mock-title');
  });
});

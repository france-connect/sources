import { render } from '@testing-library/react';

import { Dto2SectionComponent } from './dto2section.component';

describe('Dto2SectionComponent', () => {
  it('should match snapshot', () => {
    // Given
    const fieldMock = {
      label: 'any-label-mock',
      name: 'any-name-mock',
      order: expect.any(Number),
      type: expect.any(String),
    };

    // When
    const { container, getByText } = render(<Dto2SectionComponent field={fieldMock} />);
    const titleElt = getByText('any-label-mock');

    // Then
    expect(container).toMatchSnapshot();
    expect(titleElt.tagName).toBe('H3');
    expect(titleElt).toHaveClass('fr-h6');
    expect(titleElt).toHaveAttribute('data-testid', 'Dto2SectionComponent-any-name-mock-testid');
  });
});

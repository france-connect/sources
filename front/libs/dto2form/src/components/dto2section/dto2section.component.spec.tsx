import { render } from '@testing-library/react';

import { DTO2SectionComponent } from './dto2section.component';

describe('DTO2SectionComponent', () => {
  it('should match snapshot', () => {
    // Given
    const fieldMock = {
      label: 'any-label-mock',
      name: 'any-name-mock',
      order: expect.any(Number),
      type: expect.any(String),
    };

    // When
    const { container, getByText } = render(<DTO2SectionComponent field={fieldMock} />);
    const titleElt = getByText('any-label-mock');

    // Then
    expect(container).toMatchSnapshot();
    expect(titleElt.tagName).toBe('H3');
    expect(titleElt).toHaveClass('fr-h6');
    expect(titleElt).toHaveAttribute('data-testid', 'DTO2SectionComponent-any-name-mock-testid');
  });
});

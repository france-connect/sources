import { render } from '@testing-library/react';

import { TableCaptionComponent } from './table-caption.component';

describe('TableCaptionComponent', () => {
  // Given
  const table = document.createElement('table');
  const captionText = 'This is a table caption';

  it('should match the snapshot', () => {
    // When
    const { container } = render(<TableCaptionComponent caption={captionText} />, {
      container: document.body.appendChild(table),
    });

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render the caption', () => {
    // When
    const { getByText } = render(<TableCaptionComponent caption={captionText} />, {
      container: document.body.appendChild(table),
    });
    const txtElement = getByText(captionText);

    // Then
    expect(txtElement).toBeInTheDocument();
  });
});

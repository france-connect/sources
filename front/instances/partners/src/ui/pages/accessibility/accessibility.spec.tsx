import { render } from '@testing-library/react';

import { AccessibilityPage } from './accessibility';

describe('AccessibilitePage', () => {
  it('should match snapshot', () => {
    // When
    const { container } = render(<AccessibilityPage />);

    // Then
    expect(container).toMatchSnapshot();
  });
});

import { render } from '@testing-library/react';

import { MagnifierArtworkComponent } from './magnifier-artwork.component';

describe('MagnifierArtworkComponent', () => {
  it('should match the snapshot', () => {
    // When
    const { container } = render(<MagnifierArtworkComponent />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should be hidden from assistive technologies', () => {
    // When
    const { getByTestId } = render(<MagnifierArtworkComponent />);

    // Then
    expect(getByTestId('MagnifierArtworkComponent')).toHaveAttribute('aria-hidden', 'true');
  });
});

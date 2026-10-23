import { render } from '@testing-library/react';

import { DefaultArtworkComponent } from './default-artwork.component';

describe('DefaultArtworkComponent', () => {
  it('should match the snapshot', () => {
    // When
    const { container } = render(<DefaultArtworkComponent />);

    // Then
    expect(container).toMatchSnapshot();
  });
});

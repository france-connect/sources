import { render } from '@testing-library/react';

import type { TrackInterface } from '../../../interfaces';
import { TrackCardConnexionHeaderComponent } from './track-card-header.component';

describe('TrackCardConnexionHeaderComponent', () => {
  // Given
  const trackMock = {
    spLabel: 'any-acme-spLabel',
  } as TrackInterface;

  it('should match snapshot', () => {
    // When
    const { container } = render(<TrackCardConnexionHeaderComponent track={trackMock} />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render the title', () => {
    // When
    const { getByText } = render(<TrackCardConnexionHeaderComponent track={trackMock} />);
    const titleElt = getByText('any-acme-spLabel');

    // Then
    expect(titleElt).toBeInTheDocument();
  });
});

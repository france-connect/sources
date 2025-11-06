import { render } from '@testing-library/react';

import type { TrackInterface } from '../../interfaces';
import { TrackCardConnexionDetailsComponent } from './connection-details';
import { TrackCardConnexionHeaderComponent } from './header';
import { TrackCardComponent } from './track-card.component';

jest.mock('./header/track-card-header.component');
jest.mock('./connection-details/track-card-connection-details.component');

describe('TrackCardComponent', () => {
  // Given
  const trackMock = Symbol('any-acme-track-mock') as unknown as TrackInterface;

  it('should match the snapshot, when is not last', () => {
    // When
    const { container } = render(<TrackCardComponent track={trackMock} />);

    // Then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveClass('fr-mb-2w');
  });

  it('should match the snapshot, when is last', () => {
    // When
    const { container } = render(<TrackCardComponent isLast track={trackMock} />);

    // Then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).not.toHaveClass('fr-mb-2w');
  });

  it('should call TrackCardConnexionHeaderComponent with params', () => {
    // When
    render(<TrackCardComponent track={trackMock} />);

    // Then
    expect(TrackCardConnexionHeaderComponent).toHaveBeenCalledOnce();
    expect(TrackCardConnexionHeaderComponent).toHaveBeenCalledWith({ track: trackMock }, undefined);
  });

  it('should call TrackCardConnexionDetailsComponent with params', () => {
    // When
    render(<TrackCardComponent track={trackMock} />);

    // Then
    expect(TrackCardConnexionDetailsComponent).toHaveBeenCalledOnce();
    expect(TrackCardConnexionDetailsComponent).toHaveBeenCalledWith(
      { track: trackMock },
      undefined,
    );
  });
});

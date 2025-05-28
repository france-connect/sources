import { fireEvent, render } from '@testing-library/react';
import { DateTime } from 'luxon';
import { useToggle } from 'usehooks-ts';

import type { CinematicEvents, EidasToLabel } from '../../enums';
import type { EnhancedTrackInterface, RichClaimInterface } from '../../interfaces';
import { TrackCardBadgeComponent } from './card-badge.component';
import { TrackCardContentComponent } from './card-content.component';
import { TrackCardHeaderComponent } from './card-header.component';
import { TrackCardComponent } from './track-card.component';

jest.mock('./card-badge.component');
jest.mock('./card-content.component');
jest.mock('./card-header.component');

describe('TrackCardComponent', () => {
  const claims1: RichClaimInterface = {
    identifier: 'claims1',
    label: 'Claims 1 Label',
    provider: {
      label: 'Provider 1 label',
      slug: 'provider1',
    },
  };

  const claims2: RichClaimInterface = {
    identifier: 'claims2',
    label: 'Claims 2 Label',
    provider: {
      label: 'Provider 1 label',
      slug: 'provider1',
    },
  };

  const track: EnhancedTrackInterface = {
    authenticationEventId: 'mock-authentication-event-id',
    city: 'mock-city',
    claims: [claims1, claims2],
    country: 'mock-country',
    datetime: DateTime.fromObject({ day: 1, month: 10, year: 2021 }, { zone: 'Europe/Paris' }),
    event: 'MOCK_EVENT' as CinematicEvents,
    idpLabel: 'mock-idpLabel',
    interactionAcr: 'eidas1' as keyof typeof EidasToLabel,
    platform: 'FranceConnect',
    spLabel: 'mock-spLabel',
    time: 1633042800000,
    // '2021-10-01T00:00:00.000+01:00'
    trackId: 'mock-track-id',
  };

  describe('Initial component render', () => {
    beforeEach(() => {
      // Given
      jest.mocked(useToggle).mockReturnValue([false, jest.fn(), jest.fn()]);
    });

    it('should match snapshot, with default props', () => {
      // When
      const { container } = render(<TrackCardComponent track={track} />);

      // Then
      expect(container).toMatchSnapshot();
    });

    it('should render an accessible button element at container top level', () => {
      // Given
      const { getByTestId } = render(<TrackCardComponent track={track} />);

      // When
      const element = getByTestId(`${track.platform}-${track.trackId}`);

      // Then
      expect(element).toBeInTheDocument();
      expect(element.tagName).toBe('BUTTON');
      expect(element.getAttribute('type')).toBe('button');
      expect(element.getAttribute('aria-expanded')).toBe('false');
      expect(element.getAttribute('aria-controls')).toBe(`track::card::${track.trackId}`);
    });

    it('should have called card badge component', () => {
      // When
      render(<TrackCardComponent track={track} />);

      // Then
      expect(TrackCardBadgeComponent).toHaveBeenCalledWith(
        { fromFcPlus: false, type: track.event },
        undefined,
      );
    });

    it('should have called card header component', () => {
      // When
      render(<TrackCardComponent track={track} />);

      // Then
      expect(TrackCardHeaderComponent).toHaveBeenCalledWith(
        {
          datetime: track.datetime,
          opened: false,
          serviceProviderLabel: track.spLabel,
        },
        undefined,
      );
    });

    it('should have called card content component', () => {
      // When
      render(<TrackCardComponent track={track} />);

      // Then
      expect(TrackCardContentComponent).toHaveBeenCalledWith(
        {
          accessibleId: `track::card::${track.trackId}`,
          authenticationEventId: track.authenticationEventId,
          city: 'mock-city',
          claims: [claims1, claims2],
          country: 'mock-country',
          datetime: track.datetime,
          eventType: 'MOCK_EVENT',
          idpLabel: track.idpLabel,
          interactionAcr: track.interactionAcr,
          opened: false,
        },
        undefined,
      );
    });
  });

  describe('Special component render', () => {
    it('should render element at container top level', () => {
      // Given
      const spMissingTrack: EnhancedTrackInterface = {
        ...track,
        spLabel: undefined,
      };
      const { getByTestId } = render(<TrackCardComponent track={spMissingTrack} />);
      // When
      const element = getByTestId(`${track.platform}-${track.trackId}`);

      // Then
      expect(element).toBeInTheDocument();
    });

    it('should have called card header component with default spLabel', () => {
      render(<TrackCardComponent track={track} />);

      // Then
      expect(TrackCardHeaderComponent).toHaveBeenCalledWith(
        {
          datetime: track.datetime,
          opened: false,
          serviceProviderLabel: track.spLabel,
        },
        undefined,
      );
    });
  });

  it('should call useToggle hook with default prop', () => {
    // Given
    const useToggleMock = jest.mocked(useToggle);

    // When
    render(<TrackCardComponent track={track} />);

    // Then
    expect(useToggleMock).toHaveBeenCalledOnce();
    expect(useToggleMock).toHaveBeenCalledWith(false);
  });

  it('should call toggleOpened on each button click', () => {
    // Given
    const toggleMock = jest.fn();
    jest.mocked(useToggle).mockReturnValue([false, toggleMock, jest.fn()]);

    // When
    const { getByTestId } = render(<TrackCardComponent track={track} />);
    const element = getByTestId(`${track.platform}-${track.trackId}`);

    // Then
    fireEvent.click(element);
    fireEvent.click(element);
    fireEvent.click(element);

    expect(toggleMock).toHaveBeenCalledTimes(3);
  });

  it('should set useToggle hook value on each card content component', () => {
    // Given
    jest
      .mocked(useToggle)
      .mockReturnValue([
        'initial_usetoggle_value_mock' as unknown as boolean,
        jest.fn(),
        jest.fn(),
      ]);

    // When
    const { getByTestId } = render(<TrackCardComponent track={track} />);
    const element = getByTestId(`${track.platform}-${track.trackId}`);

    // Then
    expect(element.getAttribute('aria-expanded')).toBe('initial_usetoggle_value_mock');
    expect(TrackCardHeaderComponent).toHaveBeenCalledWith(
      expect.objectContaining({ opened: 'initial_usetoggle_value_mock' }),
      undefined,
    );
    expect(TrackCardContentComponent).toHaveBeenCalledWith(
      expect.objectContaining({ opened: 'initial_usetoggle_value_mock' }),
      undefined,
    );
  });
});

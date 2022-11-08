import { act, render } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { DateTime } from 'luxon';
import React from 'react';
import * as ReactRouterDom from 'react-router-dom';

import { PaginationComponent } from '@fc/dsfr';
import { renderWithRouter } from '@fc/tests-utils';

import { Track } from '../../interfaces';
import { orderGroupByKeyAsc, transformTrackToEnhanced } from '../../utils';
import { TracksGroupComponent } from './tracks-group';
import { TracksListComponent } from './tracks-list.component';
import { usePaginatedTracks } from './use-paginated-tracks.hook';

jest.mock('@fc/common');
jest.mock('@fc/dsfr');
jest.mock('./tracks-group');
jest.mock('./use-paginated-tracks.hook');
jest.mock('./../../utils/tracks.util');
jest.mock('react-router-dom');

const payloadMock = [
  {
    accountId: 'mock-accountId-1',
    city: 'mock-city-1',
    country: 'mock-country-1',
    date: '2021-10-05T14:48:00.000Z',
    datetime: DateTime.fromISO('2021-10-05T14:48:00.000Z'),
    event: 'mock-event-1',
    spAcr: 'mock-spacr-1',
    spId: 'mock-spid-1',
    spLabel: 'mock-splabel-1',
    trackId: 'mock-trackid-1',
  },
  {
    accountId: 'mock-accountId-2',
    city: 'mock-city-2',
    country: 'mock-country-2',
    date: '2021-11-05T14:48:00.000Z',
    datetime: DateTime.fromISO('2021-11-05T14:48:00.000Z'),
    event: 'mock-event-2',
    spAcr: 'mock-spacr-2',
    spId: 'mock-spid-2',
    spLabel: 'mock-splabel-2',
    trackId: 'mock-trackid-2',
  },
] as unknown as Track[];

const tracksMock = {
  meta: {
    offset: 0,
    size: 10,
    total: 100,
  },
  payload: payloadMock,
  type: 'application',
};

describe('TracksListComponent', () => {
  const usePaginatedTracksMock = mocked(usePaginatedTracks);

  beforeEach(() => {
    jest.clearAllMocks();
    usePaginatedTracksMock.mockReturnValue({ submitErrors: undefined, tracks: tracksMock });
  });

  const options = {
    API_ROUTE_TRACKS: 'mock_API_ROUTE_TRACKS',
    API_ROUTE_USER_INFOS: 'mock_API_ROUTE_USER_INFOS',
    LUXON_FORMAT_DATETIME_SHORT_FR: "D 'à' T",
    LUXON_FORMAT_DAY: 'DDD',
    LUXON_FORMAT_HOUR_MINS: 'T',
    LUXON_FORMAT_MONTH_YEAR: 'LLLL yyyy',
    LUXON_FORMAT_TIMEZONE: 'z',
  };

  it('should match snapshot', () => {
    // when
    const { container } = render(<TracksListComponent options={options} />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot when data contains no tracks', () => {
    // given
    const emptyTracksMock = {
      meta: {
        offset: 0,
        size: 10,
        total: 0,
      },

      payload: [],
      type: 'application',
    };
    usePaginatedTracksMock.mockReturnValue({ submitErrors: undefined, tracks: emptyTracksMock });
    // when
    const { container } = render(<TracksListComponent options={options} />);
    // then
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot when tracks data are not defined', () => {
    // given
    usePaginatedTracksMock.mockReturnValue({
      submitErrors: undefined,
      tracks: {
        type: 'application',
      },
    });

    // when
    const { container } = render(<TracksListComponent options={options} />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should have called usePaginatedTracks hook', () => {
    // when
    render(<TracksListComponent options={options} />);

    // then
    expect(usePaginatedTracksMock).toHaveBeenCalled();
  });

  it('should filter out nullish entries', () => {
    // Given
    const nonNullish1 = Symbol('nonNullish1') as unknown as Track;
    const nonNullish2 = Symbol('nonNullish2') as unknown as Track;

    const tracksWithNullishEntries = {
      ...tracksMock,
      payload: [
        nonNullish1,
        false as unknown as Track,
        null as unknown as Track,
        nonNullish2,
        undefined as unknown as Track,
      ],
    };
    const filteredPayload = [nonNullish1, nonNullish2];

    usePaginatedTracksMock.mockReturnValue({
      submitErrors: undefined,
      tracks: tracksWithNullishEntries,
    });

    // When
    render(<TracksListComponent options={options} />);

    // Then
    expect(transformTrackToEnhanced).toHaveBeenNthCalledWith(1, nonNullish1, 0, filteredPayload);
    expect(transformTrackToEnhanced).toHaveBeenNthCalledWith(2, nonNullish2, 1, filteredPayload);
  });

  it('should have called transformTrackToEnhanced', () => {
    // when
    render(<TracksListComponent options={options} />);

    // then
    expect(transformTrackToEnhanced).toHaveBeenCalled();
    expect(transformTrackToEnhanced).toHaveBeenNthCalledWith(1, payloadMock[0], 0, payloadMock);
    expect(transformTrackToEnhanced).toHaveBeenNthCalledWith(2, payloadMock[1], 1, payloadMock);
  });

  it('should have called orderGroupByKeyAsc', () => {
    // when
    render(<TracksListComponent options={options} />);

    // then
    expect(orderGroupByKeyAsc).toHaveBeenCalled();
  });

  it('should have called TracksGroupComponent', () => {
    // when
    render(<TracksListComponent options={options} />);

    // then
    expect(TracksGroupComponent).toHaveBeenCalled();
    expect(TracksGroupComponent).toHaveBeenNthCalledWith(
      1,
      {
        label: 'Octobre 2021',
        options,
        tracks: [payloadMock[0]],
      },
      {},
    );
    expect(TracksGroupComponent).toHaveBeenNthCalledWith(
      2,
      {
        label: 'Novembre 2021',
        options,
        tracks: [payloadMock[1]],
      },
      {},
    );
  });

  it('should not display TracksGroupComponent if tracks does not exist', () => {
    // given
    usePaginatedTracksMock.mockReturnValue({
      submitErrors: undefined,
      tracks: { ...tracksMock, payload: undefined },
    });

    // when
    render(<TracksListComponent options={options} />);

    // then
    expect(transformTrackToEnhanced).not.toHaveBeenCalled();
    expect(orderGroupByKeyAsc).not.toHaveBeenCalled();
    expect(TracksGroupComponent).not.toHaveBeenCalled();
  });

  it('should redirect to new location', () => {
    // given
    const indexMock = 20;
    const navigateFuncMock = jest.fn();
    const useCallbackMock = jest.spyOn(React, 'useCallback').mockImplementation(() => jest.fn());
    jest.spyOn(ReactRouterDom, 'useNavigate').mockImplementationOnce(() => navigateFuncMock);
    mocked(PaginationComponent).mockImplementation(() => (
      <button type="button" onClick={() => useCallbackMock}>
        foo
      </button>
    ));

    // when
    renderWithRouter(<TracksListComponent options={options} />);
    const callback = useCallbackMock.mock.calls[0][0];
    act(() => {
      callback(indexMock);
    });

    // then
    expect(navigateFuncMock).toHaveBeenCalled();
  });
});

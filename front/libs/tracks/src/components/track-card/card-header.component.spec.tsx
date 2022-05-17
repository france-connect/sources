import { render } from '@testing-library/react';
import { DateTime } from 'luxon';

import { TrackCardHeaderComponent } from './card-header.component';

describe('TrackCardHeaderComponent', () => {
  const options = {
    API_ROUTE_TRACKS: 'mock_API_ROUTE_TRACKS',
    API_ROUTE_USER_INFOS: 'mock_API_ROUTE_USER_INFOS',
    LUXON_FORMAT_DAY: 'DDD',
    LUXON_FORMAT_HOUR_MINS: 'T',
    LUXON_FORMAT_MONTH_YEAR: 'LLLL yyyy',
    LUXON_FORMAT_TIMEZONE: 'z',
  };
  const date = DateTime.fromObject({ day: 1, month: 10, year: 2021 });

  it('should have render the service provider name from props', () => {
    // given
    const { getByText } = render(
      <TrackCardHeaderComponent
        datetime={date}
        opened={false}
        options={options}
        serviceProviderLabel="any identity provider name"
      />,
    );
    // then
    const element = getByText('any identity provider name');
    expect(element).toBeInTheDocument();
  });

  it('should have render a day formatted date, using props', () => {
    // given
    const expected = date.toFormat(options.LUXON_FORMAT_DAY);
    const { getByText } = render(
      <TrackCardHeaderComponent
        datetime={date}
        opened={false}
        options={options}
        serviceProviderLabel="any"
      />,
    );
    // then
    const element = getByText(expected);
    expect(element).toBeInTheDocument();
  });

  it('should render an accessible plus icon if card is closed', () => {
    // given
    const { container } = render(
      <TrackCardHeaderComponent
        datetime={date}
        opened={false}
        options={options}
        serviceProviderLabel="any"
      />,
    );
    // then
    const elements = container.getElementsByTagName('title');
    expect(elements).toHaveLength(1);
    expect(elements[0].innerHTML).toStrictEqual('Icone plus');
  });

  it('should render an accessible minus icon if card is opened', () => {
    // given
    const { container } = render(
      <TrackCardHeaderComponent
        opened
        datetime={date}
        options={options}
        serviceProviderLabel="any"
      />,
    );
    // then
    const elements = container.getElementsByTagName('title');
    expect(elements).toHaveLength(1);
    expect(elements[0].innerHTML).toStrictEqual('Icone moins');
  });
});

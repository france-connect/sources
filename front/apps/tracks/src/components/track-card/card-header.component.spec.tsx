import { render } from '@testing-library/react';
import { DateTime } from 'luxon';

import { ConfigService } from '@fc/config';

import { TrackCardHeaderComponent } from './card-header.component';

describe('TrackCardHeaderComponent', () => {
  // Given
  const date = DateTime.fromObject({ day: 1, month: 10, year: 2021 })
    .setZone('Europe/Paris')
    .setLocale('fr');

  beforeEach(() => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValue({
      luxon: { dayFormat: 'luxon-format-day-mock' },
    });
  });

  it('should have render the service provider name from props', () => {
    // Given
    const { getByText } = render(
      <TrackCardHeaderComponent
        datetime={date}
        opened={false}
        serviceProviderLabel="any identity provider name"
      />,
    );

    // Then
    const element = getByText('any identity provider name');

    expect(element).toBeInTheDocument();
  });

  it('should have render a day formatted date, using props', () => {
    // Given
    const expected = date.toFormat('luxon-format-day-mock');
    const { getByText } = render(
      <TrackCardHeaderComponent datetime={date} opened={false} serviceProviderLabel="any" />,
    );
    // Then
    const element = getByText(expected);

    expect(element).toBeInTheDocument();
  });

  it('should render an accessible plus icon if card is closed', () => {
    // Given
    const { container } = render(
      <TrackCardHeaderComponent datetime={date} opened={false} serviceProviderLabel="any" />,
    );
    // Then
    const elements = container.getElementsByTagName('title');

    expect(elements).toHaveLength(1);
    expect(elements[0].innerHTML).toBe('Icone plus');
  });

  it('should render an accessible minus icon if card is opened', () => {
    // Given
    const { container } = render(
      <TrackCardHeaderComponent opened datetime={date} serviceProviderLabel="any" />,
    );

    // Then
    const elements = container.getElementsByTagName('title');

    expect(elements).toHaveLength(1);
    expect(elements[0].innerHTML).toBe('Icone moins');
  });
});

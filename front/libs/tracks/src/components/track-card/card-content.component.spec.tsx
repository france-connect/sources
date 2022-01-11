import { render } from '@testing-library/react';
import { DateTime } from 'luxon';

import { TrackCardContentComponent } from './card-content.component';

describe('TrackCardContentComponent', () => {
  const options = {
    API_ROUTE_TRACKS: 'mock_API_ROUTE_TRACKS',
    API_ROUTE_USER_INFOS: 'mock_API_ROUTE_USER_INFOS',
    LUXON_FORMAT_DAY: 'DDD',
    LUXON_FORMAT_HOUR_MINS: 'T',
    LUXON_FORMAT_MONTH_YEAR: 'LLLL yyyy',
    LUXON_FORMAT_TIMEZONE: 'z',
  };
  const date = DateTime.fromObject(
    { day: 1, hour: 6, minute: 32, month: 10, year: 2021 },
    { zone: 'Europe/Paris' },
  );

  it('should render a collapsible region element with negative tabindex and accessible id', () => {
    // given
    const { getByRole } = render(
      <TrackCardContentComponent
        accessibleId="mock-accessibleId"
        accountId="mock-accountId"
        datetime={date}
        opened={false}
        options={options}
        spAcr="eidas1"
      />,
    );
    // when
    const element = getByRole('region', { hidden: true });
    // then
    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute('id', 'mock-accessibleId');
    expect(element).toHaveAttribute('tabIndex', '-1');
  });

  it('should render a collapsed region element', () => {
    // given
    const opened = false;
    const { getByRole } = render(
      <TrackCardContentComponent
        accessibleId="mock-accessibleId"
        accountId="mock-accountId"
        datetime={date}
        opened={opened}
        options={options}
        spAcr="eidas1"
      />,
    );
    // when
    const element = getByRole('region', { hidden: true });
    // then
    expect(element).toBeInTheDocument();
    expect(element).not.toHaveClass('mt16');
    expect(element).toHaveClass('no-display');
    expect(element).toHaveAttribute('aria-hidden', 'true');
  });

  it('should render a expanded region element', () => {
    // given
    const opened = true;
    const { getByRole } = render(
      <TrackCardContentComponent
        accessibleId="mock-accessibleId"
        accountId="mock-accountId"
        datetime={date}
        opened={opened}
        options={options}
        spAcr="eidas1"
      />,
    );
    // when
    const element = getByRole('region', { hidden: true });
    // then
    expect(element).toBeInTheDocument();
    expect(element).toHaveClass('mt16');
    expect(element).not.toHaveClass('no-display');
    expect(element).toHaveAttribute('aria-hidden', 'false');
  });

  it('should render the title for the informations', () => {
    // given
    const { getByText } = render(
      <TrackCardContentComponent
        accessibleId="mock-accessibleId"
        accountId="mock-accessibleId"
        datetime={date}
        opened={false}
        options={options}
        spAcr="eidas1"
      />,
    );
    // when
    const element = getByText('Le service a récupéré les données suivantes');
    // then
    expect(element).toBeInTheDocument();
  });

  it('should render a list of 4 informations', () => {
    // given
    const { container } = render(
      <TrackCardContentComponent
        accessibleId="mock-accessibleId"
        accountId="mock-accessibleId"
        datetime={date}
        opened={false}
        options={options}
        spAcr="eidas1"
      />,
    );
    // when
    const elements = container.getElementsByTagName('li');
    // then
    expect(elements).toHaveLength(4);
  });

  it('should render the hour information block (label and value)', () => {
    // given
    const { getByText } = render(
      <TrackCardContentComponent
        accessibleId="mock-accessibleId"
        accountId="mock-accessibleId"
        datetime={date}
        opened={false}
        options={options}
        spAcr="eidas1"
      />,
    );
    // when
    const labelElement = getByText('Heure :');
    const valueElement = getByText('06:32 (heure de Paris)');
    const lastElement = labelElement.parentNode?.lastElementChild;
    const firstElement = labelElement.parentNode?.firstElementChild;
    // then
    expect(labelElement).toBeInTheDocument();
    expect(valueElement).toBeInTheDocument();
    expect(lastElement).toStrictEqual(lastElement);
    expect(firstElement).toStrictEqual(labelElement);
  });

  it('should render the localisation information block (label and value)', () => {
    // given
    const { getByText } = render(
      <TrackCardContentComponent
        accessibleId="mock-accessibleId"
        accountId="mock-accessibleId"
        datetime={date}
        opened={false}
        options={options}
        spAcr="eidas1"
      />,
    );
    // when
    const labelElement = getByText('Localisation :');
    const valueElement = getByText('Europe/Paris');
    const lastElement = labelElement.parentNode?.lastElementChild;
    const firstElement = labelElement.parentNode?.firstElementChild;
    // then
    expect(labelElement).toBeInTheDocument();
    expect(valueElement).toBeInTheDocument();
    expect(lastElement).toStrictEqual(lastElement);
    expect(firstElement).toStrictEqual(labelElement);
  });

  it('should render the current account information block (label and value)', () => {
    // given
    const { getByText } = render(
      <TrackCardContentComponent
        accessibleId="mock-accessibleId"
        accountId="mock-accessibleId"
        datetime={date}
        opened={false}
        options={options}
        spAcr="eidas1"
      />,
    );
    // when
    const labelElement = getByText('Compte Utilisé :');
    const valueElement = getByText('mock-accessibleId');
    const lastElement = labelElement.parentNode?.lastElementChild;
    const firstElement = labelElement.parentNode?.firstElementChild;
    // then
    expect(labelElement).toBeInTheDocument();
    expect(valueElement).toBeInTheDocument();
    expect(lastElement).toStrictEqual(lastElement);
    expect(firstElement).toStrictEqual(labelElement);
  });

  it('should render the security level information block (label and value)', () => {
    // given
    const { getByText, getByTitle } = render(
      <TrackCardContentComponent
        accessibleId="mock-accessibleId"
        accountId="mock-accessibleId"
        datetime={date}
        opened={false}
        options={options}
        spAcr="eidas1"
      />,
    );
    // when
    const labelElement = getByText('Niveau de sécurité :');
    const valueElement = getByText('faible');
    const linkElement = getByTitle('En savoir plus sur le niveau de sécurité faible');
    const lastElement = labelElement.parentNode?.lastElementChild;
    const firstElement = labelElement.parentNode?.firstElementChild;
    // then
    expect(labelElement).toBeInTheDocument();
    expect(valueElement).toBeInTheDocument();
    expect(linkElement).toBeInTheDocument();
    expect(linkElement.tagName).toStrictEqual('A');
    expect(firstElement).toStrictEqual(labelElement);
    expect(lastElement).toStrictEqual(linkElement);
    expect(lastElement).toStrictEqual(valueElement.parentNode);
  });
});

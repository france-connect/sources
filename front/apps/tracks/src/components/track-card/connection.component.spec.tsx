import { render } from '@testing-library/react';
import { DateTime } from 'luxon';

import { ConnectionComponent } from './connection.component';

describe('ConnectionComponent', () => {
  const date = DateTime.fromObject(
    { day: 1, hour: 6, minute: 32, month: 10, year: 2021 },
    { zone: 'Europe/Paris' },
  );

  const options = {
    API_ROUTE_TRACKS: 'mock_API_ROUTE_TRACKS',
    API_ROUTE_USER_INFOS: 'mock_API_ROUTE_USER_INFOS',
    LUXON_FORMAT_DATETIME_SHORT_FR: "D 'à' T",
    LUXON_FORMAT_DAY: 'DDD',
    LUXON_FORMAT_HOUR_MINS: 'T',
    LUXON_FORMAT_MONTH_YEAR: 'LLLL yyyy',
    LUXON_FORMAT_TIMEZONE: 'z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should match snapshot, with default props', () => {
    // when
    const { container } = render(
      <ConnectionComponent
        city="cityMock"
        country="countryMock"
        datetime={date}
        idpLabel="idpLabelValue"
        options={options}
        spAcr="eidas1"
      />,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should render a list of 4 informations', () => {
    // given
    const { container } = render(
      <ConnectionComponent
        city="cityMock"
        country="countryMock"
        datetime={date}
        idpLabel="idpLabelValue"
        options={options}
        spAcr="eidas1"
      />,
    );

    // when
    const elements = container.getElementsByTagName('li');

    // then
    expect(elements).toHaveLength(4);
  });

  it('should render a list of 3 informations if city and country are undefined', () => {
    // given
    const { container, queryByText } = render(
      <ConnectionComponent
        city={undefined}
        country={undefined}
        datetime={date}
        idpLabel="idpLabelValue"
        options={options}
        spAcr="eidas1"
      />,
    );

    // when
    const elements = container.getElementsByTagName('li');

    // then
    expect(elements).toHaveLength(3);
    expect(queryByText('Localisation :')).not.toBeInTheDocument();
    expect(queryByText('cityMock (countryMock)')).not.toBeInTheDocument();
  });

  it('should render the date information block (label and value)', () => {
    // given
    const { getByText } = render(
      <ConnectionComponent
        city="cityMock"
        country="countryMock"
        datetime={date}
        idpLabel="idpLabelValue"
        options={options}
        spAcr="eidas1"
      />,
    );

    // when
    const labelElement = getByText('Une connexion à ce service a eu lieu le :');
    const valueElement = getByText('01/10/2021 à 06:32 (heure de Paris)');
    const lastElement = labelElement.parentNode?.lastElementChild;
    const firstElement = labelElement.parentNode?.firstElementChild;

    // then
    expect(labelElement).toBeInTheDocument();
    expect(valueElement).toBeInTheDocument();
    expect(lastElement).toStrictEqual(valueElement);
    expect(firstElement).toStrictEqual(labelElement);
  });

  it('should render the localisation information block (label and value)', () => {
    // given
    const { getByText } = render(
      <ConnectionComponent
        city="cityMock"
        country="countryMock"
        datetime={date}
        idpLabel="idpLabelValue"
        options={options}
        spAcr="eidas1"
      />,
    );

    // when
    const labelElement = getByText('Localisation :');
    const valueElement = getByText('cityMock (countryMock)');
    const lastElement = labelElement.parentNode?.lastElementChild;
    const firstElement = labelElement.parentNode?.firstElementChild;

    // then
    expect(labelElement).toBeInTheDocument();
    expect(valueElement).toBeInTheDocument();
    expect(firstElement).toStrictEqual(labelElement);
    expect(lastElement).toStrictEqual(valueElement);
  });

  it('should only render the city localisation information block (label and value)', () => {
    // given
    const { getByText } = render(
      <ConnectionComponent
        city="cityMock"
        country={undefined}
        datetime={date}
        idpLabel="idpLabelValue"
        options={options}
        spAcr="eidas1"
      />,
    );

    // when
    const labelElement = getByText('Localisation :');
    const valueElement = getByText('cityMock');
    const lastElement = labelElement.parentNode?.lastElementChild;
    const firstElement = labelElement.parentNode?.firstElementChild;

    // then
    expect(labelElement).toBeInTheDocument();
    expect(valueElement).toBeInTheDocument();
    expect(firstElement).toStrictEqual(labelElement);
    expect(lastElement).toStrictEqual(valueElement);
  });

  it('should only render the country localisation information block (label and value)', () => {
    // given
    const { getByText } = render(
      <ConnectionComponent
        city={undefined}
        country="countryMock"
        datetime={date}
        idpLabel="idpLabelValue"
        options={options}
        spAcr="eidas1"
      />,
    );

    // when
    const labelElement = getByText('Localisation :');
    const valueElement = getByText('(countryMock)');
    const lastElement = labelElement.parentNode?.lastElementChild;
    const firstElement = labelElement.parentNode?.firstElementChild;

    // then
    expect(labelElement).toBeInTheDocument();
    expect(valueElement).toBeInTheDocument();
    expect(firstElement).toStrictEqual(labelElement);
    expect(lastElement).toStrictEqual(valueElement);
  });

  it('should render the idp name information block (label and value)', () => {
    // given
    const { getByText } = render(
      <ConnectionComponent
        city="cityMock"
        country="countryMock"
        datetime={date}
        idpLabel="idpLabelValue"
        options={options}
        spAcr="eidas1"
      />,
    );

    // when
    const labelElement = getByText('Via le compte :');
    const valueElement = getByText('idpLabelValue');
    const lastElement = labelElement.parentNode?.lastElementChild;
    const firstElement = labelElement.parentNode?.firstElementChild;

    // then
    expect(labelElement).toBeInTheDocument();
    expect(valueElement).toBeInTheDocument();
    expect(lastElement).toStrictEqual(valueElement);
    expect(firstElement).toStrictEqual(labelElement);
  });

  it('should render the security level information block (label and value)', () => {
    // given
    const { getByText } = render(
      <ConnectionComponent
        city="cityMock"
        country="countryMock"
        datetime={date}
        idpLabel="idpLabelValue"
        options={options}
        spAcr="eidas1"
      />,
    );

    // when
    const labelElement = getByText('Niveau de garantie eIDAS :');
    const valueElement = getByText('Faible');
    const firstElement = labelElement.parentNode?.firstElementChild;

    // then
    expect(labelElement).toBeInTheDocument();
    expect(valueElement).toBeInTheDocument();
    expect(firstElement).toStrictEqual(labelElement);
  });
});

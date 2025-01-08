import { render } from '@testing-library/react';
import { DateTime } from 'luxon';

import { ConfigService } from '@fc/config';

import { ConnectionComponent } from './connection.component';

describe('ConnectionComponent', () => {
  const date = DateTime.fromObject(
    { day: 1, hour: 6, minute: 32, month: 10, year: 2021 },
    { zone: 'Europe/Paris' },
  );

  const authenticationEventId = 'mock-authentication-event-id';

  beforeEach(() => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValue({
      luxon: { datetimeShortFrFormat: "D 'à' T" },
    });
  });

  it('should call ConfigService.get with the right parameter', () => {
    // When
    render(
      <ConnectionComponent
        authenticationEventId={authenticationEventId}
        city="cityMock"
        country="countryMock"
        datetime={date}
        idpLabel="idpLabelValue"
        interactionAcr="eidas1"
      />,
    );

    // Then
    expect(ConfigService.get).toHaveBeenCalledOnce();
    expect(ConfigService.get).toHaveBeenCalledWith('Tracks');
  });

  it('should match snapshot, with default props', () => {
    // When
    const { container } = render(
      <ConnectionComponent
        authenticationEventId={authenticationEventId}
        city="cityMock"
        country="countryMock"
        datetime={date}
        idpLabel="idpLabelValue"
        interactionAcr="eidas1"
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render a list of 4 informations', () => {
    // Given
    const { container } = render(
      <ConnectionComponent
        authenticationEventId={authenticationEventId}
        city="cityMock"
        country="countryMock"
        datetime={date}
        idpLabel="idpLabelValue"
        interactionAcr="eidas1"
      />,
    );

    // When
    const elements = container.getElementsByTagName('li');

    // Then
    expect(elements).toHaveLength(5);
  });

  it('should render a list of 3 informations if city and country are undefined', () => {
    // Given
    const { container, queryByText } = render(
      <ConnectionComponent
        authenticationEventId={authenticationEventId}
        city={undefined}
        country={undefined}
        datetime={date}
        idpLabel="idpLabelValue"
        interactionAcr="eidas1"
      />,
    );

    // When
    const elements = container.getElementsByTagName('li');

    // Then
    expect(elements).toHaveLength(4);
    expect(queryByText('Localisation :')).not.toBeInTheDocument();
    expect(queryByText('cityMock (countryMock)')).not.toBeInTheDocument();
  });

  it('should render the date information block (label and value)', () => {
    // Given
    const { getByText } = render(
      <ConnectionComponent
        authenticationEventId={authenticationEventId}
        city="cityMock"
        country="countryMock"
        datetime={date}
        idpLabel="idpLabelValue"
        interactionAcr="eidas1"
      />,
    );

    // When
    const labelElement = getByText('Une connexion à ce service a eu lieu le :');
    const valueElement = getByText('01/10/2021 à 06:32 (heure de Paris)');
    const lastElement = labelElement.parentNode?.lastElementChild;
    const firstElement = labelElement.parentNode?.firstElementChild;

    // Then
    expect(labelElement).toBeInTheDocument();
    expect(valueElement).toBeInTheDocument();
    expect(lastElement).toStrictEqual(valueElement);
    expect(firstElement).toStrictEqual(labelElement);
  });

  it('should render the localisation information block (label and value)', () => {
    // Given
    const { getByText } = render(
      <ConnectionComponent
        authenticationEventId={authenticationEventId}
        city="cityMock"
        country="countryMock"
        datetime={date}
        idpLabel="idpLabelValue"
        interactionAcr="eidas1"
      />,
    );

    // When
    const labelElement = getByText('Localisation :');
    const valueElement = getByText('cityMock (countryMock)');
    const lastElement = labelElement.parentNode?.lastElementChild;
    const firstElement = labelElement.parentNode?.firstElementChild;

    // Then
    expect(labelElement).toBeInTheDocument();
    expect(valueElement).toBeInTheDocument();
    expect(firstElement).toStrictEqual(labelElement);
    expect(lastElement).toStrictEqual(valueElement);
  });

  it('should only render the city localisation information block (label and value)', () => {
    // Given
    const { getByText } = render(
      <ConnectionComponent
        authenticationEventId={authenticationEventId}
        city="cityMock"
        country={undefined}
        datetime={date}
        idpLabel="idpLabelValue"
        interactionAcr="eidas1"
      />,
    );

    // When
    const labelElement = getByText('Localisation :');
    const valueElement = getByText('cityMock');
    const lastElement = labelElement.parentNode?.lastElementChild;
    const firstElement = labelElement.parentNode?.firstElementChild;

    // Then
    expect(labelElement).toBeInTheDocument();
    expect(valueElement).toBeInTheDocument();
    expect(firstElement).toStrictEqual(labelElement);
    expect(lastElement).toStrictEqual(valueElement);
  });

  it('should only render the country localisation information block (label and value)', () => {
    // Given
    const { getByText } = render(
      <ConnectionComponent
        authenticationEventId={authenticationEventId}
        city={undefined}
        country="countryMock"
        datetime={date}
        idpLabel="idpLabelValue"
        interactionAcr="eidas1"
      />,
    );

    // When
    const labelElement = getByText('Localisation :');
    const valueElement = getByText('(countryMock)');
    const lastElement = labelElement.parentNode?.lastElementChild;
    const firstElement = labelElement.parentNode?.firstElementChild;

    // Then
    expect(labelElement).toBeInTheDocument();
    expect(valueElement).toBeInTheDocument();
    expect(firstElement).toStrictEqual(labelElement);
    expect(lastElement).toStrictEqual(valueElement);
  });

  it('should render the idp name information block (label and value)', () => {
    // Given
    const { getByText } = render(
      <ConnectionComponent
        authenticationEventId={authenticationEventId}
        city="cityMock"
        country="countryMock"
        datetime={date}
        idpLabel="idpLabelValue"
        interactionAcr="eidas1"
      />,
    );

    // When
    const labelElement = getByText('Via le compte :');
    const valueElement = getByText('idpLabelValue');
    const lastElement = labelElement.parentNode?.lastElementChild;
    const firstElement = labelElement.parentNode?.firstElementChild;

    // Then
    expect(labelElement).toBeInTheDocument();
    expect(valueElement).toBeInTheDocument();
    expect(lastElement).toStrictEqual(valueElement);
    expect(firstElement).toStrictEqual(labelElement);
  });

  it('should render the security level information block (label and value)', () => {
    // Given
    const { getByText } = render(
      <ConnectionComponent
        authenticationEventId={authenticationEventId}
        city="cityMock"
        country="countryMock"
        datetime={date}
        idpLabel="idpLabelValue"
        interactionAcr="eidas1"
      />,
    );

    // When
    const labelElement = getByText('Niveau de garantie eIDAS :');
    const valueElement = getByText('Faible');
    const firstElement = labelElement.parentNode?.firstElementChild;

    // Then
    expect(labelElement).toBeInTheDocument();
    expect(valueElement).toBeInTheDocument();
    expect(firstElement).toStrictEqual(labelElement);
  });

  it('should render the authenticationEventId block', () => {
    // Given
    const { getByText } = render(
      <ConnectionComponent
        authenticationEventId={authenticationEventId}
        city="cityMock"
        country="countryMock"
        datetime={date}
        idpLabel="idpLabelValue"
        interactionAcr="eidas1"
      />,
    );

    // When
    const labelElement = getByText('Code d’identification :');
    const valueElement = getByText('mock-authentication-event-id');
    const firstElement = labelElement.parentNode?.firstElementChild;

    // Then
    expect(labelElement).toBeInTheDocument();
    expect(valueElement).toBeInTheDocument();
    expect(firstElement).toStrictEqual(labelElement);
  });
});

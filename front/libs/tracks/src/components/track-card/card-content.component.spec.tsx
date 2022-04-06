import { render } from '@testing-library/react';
import { DateTime } from 'luxon';

import { TrackCardContentComponent } from './card-content.component';

describe('TrackCardContentComponent', () => {
  const claimsMock = ['claims1Mock', 'claims2Mock'];
  const date = DateTime.fromObject(
    { day: 1, hour: 6, minute: 32, month: 10, year: 2021 },
    { zone: 'Europe/Paris' },
  );

  it('should render a collapsible region element with negative tabindex and accessible id', () => {
    // given
    const { getByRole } = render(
      <TrackCardContentComponent
        accessibleId="mock-accessibleId"
        city="cityMock"
        claims={claimsMock}
        country="countryMock"
        datetime={date}
        idpName="idpNameValue"
        opened={false}
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
        city="cityMock"
        claims={claimsMock}
        country="countryMock"
        datetime={date}
        idpName="idpNameValue"
        opened={opened}
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
        city="cityMock"
        claims={claimsMock}
        country="countryMock"
        datetime={date}
        idpName="idpNameValue"
        opened={opened}
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
        city="cityMock"
        claims={claimsMock}
        country="countryMock"
        datetime={date}
        idpName="idpNameValue"
        opened={false}
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
        city="cityMock"
        claims={claimsMock}
        country="countryMock"
        datetime={date}
        idpName="idpNameValue"
        opened={false}
        spAcr="eidas1"
      />,
    );
    // when
    const elements = container.getElementsByTagName('li');
    // then
    expect(elements).toHaveLength(5);
  });

  it('should render the date information block (label and value)', () => {
    // given
    const { getByText } = render(
      <TrackCardContentComponent
        accessibleId="mock-accessibleId"
        city="cityMock"
        claims={claimsMock}
        country="countryMock"
        datetime={date}
        idpName="idpNameValue"
        opened={false}
        spAcr="eidas1"
      />,
    );
    // when
    const labelElement = getByText('Connexion à ce service a eu lieu le :');
    const valueElement = getByText('1 oct. 2021, 06:32 (heure de Paris)');
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
        city="cityMock"
        claims={claimsMock}
        country="countryMock"
        datetime={date}
        idpName="idpNameValue"
        opened={false}
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
    expect(lastElement).toStrictEqual(lastElement);
    expect(firstElement).toStrictEqual(labelElement);
  });

  it('should render the idp name information block (label and value)', () => {
    // given
    const { getByText } = render(
      <TrackCardContentComponent
        accessibleId="mock-accessibleId"
        city="cityMock"
        claims={claimsMock}
        country="countryMock"
        datetime={date}
        idpName="idpNameValue"
        opened={false}
        spAcr="eidas1"
      />,
    );
    // when
    const labelElement = getByText('Via le compte :');
    const valueElement = getByText('idpNameValue');
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
        city="cityMock"
        claims={claimsMock}
        country="countryMock"
        datetime={date}
        idpName="idpNameValue"
        opened={false}
        spAcr="eidas1"
      />,
    );
    // when
    const labelElement = getByText('Niveau de garantie eIDAS :');
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

  it('should render the claims information block (label and value)', () => {
    // given
    const { getByText } = render(
      <TrackCardContentComponent
        accessibleId="mock-accessibleId"
        city="cityMock"
        claims={claimsMock}
        country="countryMock"
        datetime={date}
        idpName="idpNameValue"
        opened={false}
        spAcr="eidas1"
      />,
    );
    // when
    const labelElement = getByText('Récupération des données :');
    const valueElement = getByText('claims1Mock, claims2Mock');
    const lastElement = labelElement.parentNode?.lastElementChild;
    const firstElement = labelElement.parentNode?.firstElementChild;
    // then
    expect(labelElement).toBeInTheDocument();
    expect(valueElement).toBeInTheDocument();
    expect(firstElement).toStrictEqual(labelElement);
    expect(lastElement).toStrictEqual(valueElement);
  });
});

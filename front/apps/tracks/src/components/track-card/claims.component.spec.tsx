import { render } from '@testing-library/react';
import { DateTime } from 'luxon';

import { ConfigService } from '@fc/config';

import type { RichClaimInterface } from '../../interfaces';
import { ClaimsComponent } from './claims.component';

describe('ConnexionComponent', () => {
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

  const claimsMock = [claims1, claims2];
  const date = DateTime.fromObject(
    { day: 1, hour: 6, minute: 32, month: 10, year: 2021 },
    { zone: 'Europe/Paris' },
  );

  const eventTypeMock = 'eventTypeMockValue';

  beforeEach(() => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValue({
      luxon: { datetimeShortFrFormat: "D 'à' T" },
    });
  });

  it('should call ConfigService.get with the right parameter', () => {
    // When
    render(<ClaimsComponent claims={claimsMock} datetime={date} eventType={eventTypeMock} />);

    // Then
    expect(ConfigService.get).toHaveBeenCalledOnce();
    expect(ConfigService.get).toHaveBeenCalledWith('Tracks');
  });

  it('should match snapshot, with default props', () => {
    // When
    const { container } = render(
      <ClaimsComponent claims={claimsMock} datetime={date} eventType={eventTypeMock} />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render global title for autorisation', () => {
    // Given
    const { getByText } = render(
      <ClaimsComponent claims={claimsMock} datetime={date} eventType={eventTypeMock} />,
    );

    // When
    const element = getByText(
      'Vous avez autorisé la transmission de données personnelles à ce service le :',
    );

    // Then
    expect(element).toBeInTheDocument();
  });

  it('should render global title for data transfer', () => {
    // Given
    const { getByText } = render(
      <ClaimsComponent claims={claimsMock} datetime={date} eventType="DP_VERIFIED_FC_CHECKTOKEN" />,
    );

    // When
    const element = getByText('Des données ont été transmises à ce service le :');

    // Then
    expect(element).toBeInTheDocument();
  });

  it('should render data provider title for autorisation', () => {
    // Given
    const { getByText } = render(
      <ClaimsComponent claims={claimsMock} datetime={date} eventType={eventTypeMock} />,
    );

    // When
    const element = getByText(
      /^Vous avez autorisé le service à récupérer les données suivantes depuis .+/,
    );

    // Then
    expect(element).toBeInTheDocument();
  });

  it('should render data provider title for data transfer', () => {
    // Given
    const { getByText } = render(
      <ClaimsComponent claims={claimsMock} datetime={date} eventType="DP_VERIFIED_FC_CHECKTOKEN" />,
    );

    // When
    const element = getByText(/^Le service a récupéré les données suivantes depuis .+/);

    // Then
    expect(element).toBeInTheDocument();
  });

  it('should render a list of 2 informations', () => {
    // Given
    const { container } = render(
      <ClaimsComponent claims={claimsMock} datetime={date} eventType={eventTypeMock} />,
    );

    // When
    const elements = container.getElementsByTagName('li');

    // Then
    expect(elements).toHaveLength(2);
  });
});

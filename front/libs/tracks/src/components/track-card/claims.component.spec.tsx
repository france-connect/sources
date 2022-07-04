import { render } from '@testing-library/react';
import { DateTime } from 'luxon';

import { IRichClaim } from '../../interfaces';
import { ClaimsComponent } from './claims.component';

describe('ConnexionComponent', () => {
  const claims1: IRichClaim = {
    identifier: 'claims1',
    label: 'Claims 1 Label',
    provider: {
      key: 'provider1',
      label: 'Provider 1 label',
    },
  };
  const claims2: IRichClaim = {
    identifier: 'claims2',
    label: 'Claims 2 Label',
    provider: {
      key: 'provider1',
      label: 'Provider 1 label',
    },
  };

  const claimsMock = [claims1, claims2];
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

  const eventTypeMock = 'eventTypeMockValue';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should match snapshot, with default props', () => {
    // when
    const { container } = render(
      <ClaimsComponent
        claims={claimsMock}
        datetime={date}
        eventType={eventTypeMock}
        options={options}
      />,
    );
    // then
    expect(container).toMatchSnapshot();
  });

  it('should render global title for autorisation', () => {
    // given
    const { getByText } = render(
      <ClaimsComponent
        claims={claimsMock}
        datetime={date}
        eventType={eventTypeMock}
        options={options}
      />,
    );
    // when
    const element = getByText(
      'Vous avez autorisé la transmission de données personnelles à ce service le :',
    );
    // then
    expect(element).toBeInTheDocument();
  });

  it('should render global title for data transfer', () => {
    // given
    const { getByText } = render(
      <ClaimsComponent
        claims={claimsMock}
        datetime={date}
        eventType="DP_REQUESTED_FC_CHECKTOKEN"
        options={options}
      />,
    );
    // when
    const element = getByText('Des données ont été transmises à ce service le :');
    // then
    expect(element).toBeInTheDocument();
  });

  it('should render data provider title for autorisation', () => {
    // given
    const { getByText } = render(
      <ClaimsComponent
        claims={claimsMock}
        datetime={date}
        eventType={eventTypeMock}
        options={options}
      />,
    );
    // when
    const element = getByText(
      /^Vous avez autorisé le service à récupérer les données suivantes depuis .+/,
    );
    // then
    expect(element).toBeInTheDocument();
  });

  it('should render data provider title for data transfer', () => {
    // given
    const { getByText } = render(
      <ClaimsComponent
        claims={claimsMock}
        datetime={date}
        eventType="DP_REQUESTED_FC_CHECKTOKEN"
        options={options}
      />,
    );
    // when
    const element = getByText(/^Le service a récupéré les données suivantes depuis .+/);
    // then
    expect(element).toBeInTheDocument();
  });

  it('should render a list of 2 informations', () => {
    // given
    const { container } = render(
      <ClaimsComponent
        claims={claimsMock}
        datetime={date}
        eventType={eventTypeMock}
        options={options}
      />,
    );
    // when
    const elements = container.getElementsByTagName('li');
    // then
    expect(elements).toHaveLength(2);
  });
});

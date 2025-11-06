import { render } from '@testing-library/react';
import { DateTime } from 'luxon';

import { ConfigService } from '@fc/config';
import { t } from '@fc/i18n';

import type { TrackInterface } from '../../../interfaces';
import { TrackCardConnexionDetailsComponent } from './track-card-connection-details.component';

// @TODO Créer un mock global pour luxon
jest.mock('luxon', () => ({
  ...jest.requireActual('luxon'),
  DateTime: {
    fromMillis: jest.fn(() => ({
      setZone: jest.fn(() => ({
        setLocale: jest.fn(() => ({
          toFormat: jest.fn(() => 'luxon-formatted-date-time-mock'),
        })),
      })),
    })),
  },
}));

describe('TrackCardConnexionDetailsComponent', () => {
  // Given
  const datetimeShortFrFormatMock = 'dd/MM/yyyy HH:mm';
  const toFormatMock = jest.fn().mockReturnValue('any-acme-formatted-time');
  const setLocaleMock = jest.fn().mockReturnValue({ toFormat: toFormatMock });
  const setZoneMock = jest.fn().mockReturnValue({ setLocale: setLocaleMock });
  const trackMock = {
    idpLabel: 'any-acme-idp-label',
    time: 1633072800000,
  } as TrackInterface;

  beforeEach(() => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValue({
      luxon: {
        datetimeShortFrFormat: datetimeShortFrFormatMock,
      },
    });
    jest
      .mocked(DateTime.fromMillis)
      .mockReturnValueOnce({ setZone: setZoneMock } as unknown as DateTime);
    jest
      .mocked(t)
      .mockReturnValueOnce('CoreUserDashboard.trackCard.connectedAt-mock')
      .mockReturnValueOnce('CoreUserDashboard.trackCard.CEST-mock')
      .mockReturnValueOnce('CoreUserDashboard.trackCard.connectedVia-mock');
  });

  it('should match snapshot', () => {
    // When
    const { container } = render(<TrackCardConnexionDetailsComponent track={trackMock} />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call ConfigService.get with params', () => {
    // When
    render(<TrackCardConnexionDetailsComponent track={trackMock} />);

    // Then
    expect(ConfigService.get).toHaveBeenCalledExactlyOnceWith('Tracks');
  });

  it('should render i18n translations', () => {
    // When
    const { getByText } = render(<TrackCardConnexionDetailsComponent track={trackMock} />);
    const connectedAtElt = getByText('CoreUserDashboard.trackCard.connectedAt-mock');
    const cestElt = getByText('CoreUserDashboard.trackCard.CEST-mock');
    const connectedViaElt = getByText('CoreUserDashboard.trackCard.connectedVia-mock');

    // Then
    expect(connectedAtElt).toBeInTheDocument();
    expect(cestElt).toBeInTheDocument();
    expect(connectedViaElt).toBeInTheDocument();
    expect(t).toHaveBeenCalledTimes(3);
    expect(t).toHaveBeenNthCalledWith(1, 'CoreUserDashboard.trackCard.connectedAt');
    expect(t).toHaveBeenNthCalledWith(2, 'CoreUserDashboard.trackCard.CEST', {
      time: 'any-acme-formatted-time',
    });
    expect(t).toHaveBeenNthCalledWith(3, 'CoreUserDashboard.trackCard.connectedVia');
  });

  it('should render the idpLabel', () => {
    // When
    const { getByText } = render(<TrackCardConnexionDetailsComponent track={trackMock} />);
    const idpLabelElt = getByText(trackMock.idpLabel);

    // Then
    expect(idpLabelElt).toBeInTheDocument();
  });

  it('should render the formatted time', () => {
    // When
    render(<TrackCardConnexionDetailsComponent track={trackMock} />);

    // Then
    expect(DateTime.fromMillis).toHaveBeenCalledWith(trackMock.time);
    expect(setZoneMock).toHaveBeenCalledWith('Europe/Paris');
    expect(setLocaleMock).toHaveBeenCalledWith('fr');
    expect(toFormatMock).toHaveBeenCalledWith(datetimeShortFrFormatMock);
  });
});

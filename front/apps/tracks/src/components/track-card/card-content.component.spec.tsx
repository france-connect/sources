import { render } from '@testing-library/react';
import { DateTime } from 'luxon';

import { CinematicEvents } from '../../enums';
import type { RichClaimInterface } from '../../interfaces';
import { TrackCardContentComponent } from './card-content.component';
import { ClaimsComponent } from './claims.component';
import { ConnectionComponent } from './connection.component';

jest.mock('./connection.component');
jest.mock('./claims.component');

describe('TrackCardContentComponent', () => {
  const claims1: RichClaimInterface = {
    identifier: 'claims1',
    label: 'Claims 1 Label',
    provider: {
      label: 'Provider 1 label',
      slug: 'provider1_key',
    },
  };

  const claims2: RichClaimInterface = {
    identifier: 'claims2',
    label: 'Claims 2 Label',
    provider: {
      label: 'Provider 1 label',
      slug: 'provider1_key',
    },
  };

  const claimsMock = [claims1, claims2];
  const date = DateTime.fromObject(
    { day: 1, hour: 6, minute: 32, month: 10, year: 2021 },
    { zone: 'Europe/Paris' },
  );

  const authenticationEventId = 'mock-authentication-event-id';

  it('should match snapshot, for connection', () => {
    // When
    const { container } = render(
      <TrackCardContentComponent
        accessibleId="mock-accessibleId"
        authenticationEventId={authenticationEventId}
        city="cityMock"
        claims={claimsMock}
        country="countryMock"
        datetime={date}
        eventType={CinematicEvents.FC_VERIFIED}
        idpLabel="idpLabelValue"
        interactionAcr="eidas1"
        opened={false}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot, for claims', () => {
    // When
    const { container } = render(
      <TrackCardContentComponent
        accessibleId="mock-accessibleId"
        authenticationEventId={authenticationEventId}
        city="cityMock"
        claims={claimsMock}
        country="countryMock"
        datetime={date}
        eventType={CinematicEvents.DP_VERIFIED_FC_CHECKTOKEN}
        idpLabel="idpLabelValue"
        interactionAcr="eidas1"
        opened={false}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should display ConnectionComponent and not ClaimsComponent', () => {
    // Given
    const eventType = 'FC_VERIFIED' as CinematicEvents;

    // When
    render(
      <TrackCardContentComponent
        accessibleId="mock-accessibleId"
        authenticationEventId={authenticationEventId}
        city="cityMock"
        claims={claimsMock}
        country="countryMock"
        datetime={date}
        eventType={eventType}
        idpLabel="idpLabelValue"
        interactionAcr="eidas1"
        opened={false}
      />,
    );

    // Then
    expect(ConnectionComponent).toHaveBeenCalledOnce();

    expect(ConnectionComponent).toHaveBeenCalledWith(
      {
        authenticationEventId,
        city: 'cityMock',
        country: 'countryMock',
        datetime: date,
        idpLabel: 'idpLabelValue',
        interactionAcr: 'eidas1',
      },
      {},
    );
  });

  it('should display ClaimsComponent and not ConnectionComponent', () => {
    // Given
    const eventType = 'FC_DATATRANSFER_CONSENT_IDENTITY' as CinematicEvents;

    // When
    render(
      <TrackCardContentComponent
        accessibleId="mock-accessibleId"
        authenticationEventId={authenticationEventId}
        city="cityMock"
        claims={claimsMock}
        country="countryMock"
        datetime={date}
        eventType={eventType}
        idpLabel="idpLabelValue"
        interactionAcr="eidas1"
        opened={false}
      />,
    );

    // Then
    expect(ClaimsComponent).toHaveBeenCalledOnce();

    expect(ClaimsComponent).toHaveBeenCalledWith(
      {
        claims: claimsMock,
        datetime: date,
        eventType,
      },
      {},
    );
  });
});

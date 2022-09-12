import { render } from '@testing-library/react';

import { CinematicEvents } from '../../enums';
import { TrackCardBadgeComponent } from './card-badge.component';

describe('TrackCardBadgeComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should match the snapshot', () => {
    // when
    const { container } = render(
      <TrackCardBadgeComponent fromFcPlus={false} type={CinematicEvents.FC_VERIFIED} />,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should render the FranceConnect badge', () => {
    // given
    const { getByText } = render(
      <TrackCardBadgeComponent fromFcPlus={false} type={CinematicEvents.FC_VERIFIED} />,
    );

    // when
    const element = getByText('FranceConnect');

    // then
    expect(element).toBeInTheDocument();
    expect(element).toHaveClass('badgeFranceConnect');
    expect(element).not.toHaveClass('badgeFranceConnectPlus');
  });

  it('should render the FranceConnectPlus badge', () => {
    // given
    const { getByText } = render(
      <TrackCardBadgeComponent fromFcPlus type={CinematicEvents.FC_VERIFIED} />,
    );

    // when
    const element = getByText('FranceConnect+');

    // then
    expect(element).toBeInTheDocument();
    expect(element).toHaveClass('badgeFranceConnectPlus');
    expect(element).not.toHaveClass('badgeFranceConnect');
  });

  it('should render the FC_VERIFIED badge', () => {
    // given
    const { getByText } = render(
      <TrackCardBadgeComponent fromFcPlus type={CinematicEvents.FC_VERIFIED} />,
    );

    // when
    const element = getByText('Connexion');

    // then
    expect(element).toBeInTheDocument();
  });

  it('should render the FC_DATATRANSFER_CONSENT_IDENTITY badge', () => {
    // given
    const { getByText } = render(
      <TrackCardBadgeComponent
        fromFcPlus
        type={CinematicEvents.FC_DATATRANSFER_CONSENT_IDENTITY}
      />,
    );

    // when
    const element = getByText('Autorisation');

    // then
    expect(element).toBeInTheDocument();
  });

  it('should render the FC_DATATRANSFER_CONSENT_DATA badge', () => {
    // given
    const { getByText } = render(
      <TrackCardBadgeComponent fromFcPlus type={CinematicEvents.FC_DATATRANSFER_CONSENT_DATA} />,
    );

    // when
    const element = getByText('Autorisation');

    // then
    expect(element).toBeInTheDocument();
  });

  it('should render the DP_REQUESTED_FC_CHECKTOKEN badge', () => {
    // given
    const { getByText } = render(
      <TrackCardBadgeComponent fromFcPlus type={CinematicEvents.DP_REQUESTED_FC_CHECKTOKEN} />,
    );

    // when
    const element = getByText('Échange de Données');

    // then
    expect(element).toBeInTheDocument();
  });

  it('should not render any type badge', () => {
    // when
    const { getByTestId } = render(<TrackCardBadgeComponent fromFcPlus type={undefined} />);

    // then
    expect(() => getByTestId('badge')).toThrow();
  });
});

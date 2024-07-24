import { render } from '@testing-library/react';

import { useStylesQuery, useStylesVariables } from '@fc/styles';

import { CinematicEvents } from '../../enums';
import { TrackCardBadgeComponent } from './card-badge.component';

describe('TrackCardBadgeComponent', () => {
  beforeEach(() => {
    // @NOTE used to prevent useStylesVariables.useStylesContext to throw
    // useStylesContext requires to be into a StylesProvider context
    jest.mocked(useStylesVariables).mockReturnValueOnce([expect.any(Number), expect.any(Number)]);
  });

  it('should match the snapshot when breakpoint is greater than mobile', () => {
    // given
    jest.mocked(useStylesQuery).mockReturnValue(true);

    // when
    const { container } = render(
      <TrackCardBadgeComponent fromFcPlus={false} type={CinematicEvents.FC_VERIFIED} />,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot when breakpoint is lower than mobile', () => {
    // given
    jest.mocked(useStylesQuery).mockReturnValue(false);

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

  it('should render the DP_VERIFIED_FC_CHECKTOKEN badge', () => {
    // given
    const { getByText } = render(
      <TrackCardBadgeComponent fromFcPlus type={CinematicEvents.DP_VERIFIED_FC_CHECKTOKEN} />,
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

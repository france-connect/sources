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
    // Given
    jest.mocked(useStylesQuery).mockReturnValue(true);

    // When
    const { container } = render(
      <TrackCardBadgeComponent fromFcPlus={false} type={CinematicEvents.FC_VERIFIED} />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot when breakpoint is lower than mobile', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValue(false);

    // When
    const { container } = render(
      <TrackCardBadgeComponent fromFcPlus={false} type={CinematicEvents.FC_VERIFIED} />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render the FranceConnect badge', () => {
    // Given
    const { getByText } = render(
      <TrackCardBadgeComponent fromFcPlus={false} type={CinematicEvents.FC_VERIFIED} />,
    );

    // When
    const element = getByText('FranceConnect');

    // Then
    expect(element).toBeInTheDocument();
    expect(element).toHaveClass('badgeFranceConnect');
    expect(element).not.toHaveClass('badgeFranceConnectPlus');
  });

  it('should render the FranceConnectPlus badge', () => {
    // Given
    const { getByText } = render(
      <TrackCardBadgeComponent fromFcPlus type={CinematicEvents.FC_VERIFIED} />,
    );

    // When
    const element = getByText('FranceConnect+');

    // Then
    expect(element).toBeInTheDocument();
    expect(element).toHaveClass('badgeFranceConnectPlus');
    expect(element).not.toHaveClass('badgeFranceConnect');
  });

  it('should render the FC_VERIFIED badge', () => {
    // Given
    const { getByText } = render(
      <TrackCardBadgeComponent fromFcPlus type={CinematicEvents.FC_VERIFIED} />,
    );

    // When
    const element = getByText('Connexion');

    // Then
    expect(element).toBeInTheDocument();
  });

  it('should render the FC_DATATRANSFER_CONSENT_IDENTITY badge', () => {
    // Given
    const { getByText } = render(
      <TrackCardBadgeComponent
        fromFcPlus
        type={CinematicEvents.FC_DATATRANSFER_CONSENT_IDENTITY}
      />,
    );

    // When
    const element = getByText('Autorisation');

    // Then
    expect(element).toBeInTheDocument();
  });

  it('should render the DP_VERIFIED_FC_CHECKTOKEN badge', () => {
    // Given
    const { getByText } = render(
      <TrackCardBadgeComponent fromFcPlus type={CinematicEvents.DP_VERIFIED_FC_CHECKTOKEN} />,
    );

    // When
    const element = getByText('Échange de Données');

    // Then
    expect(element).toBeInTheDocument();
  });

  it('should not render any type badge', () => {
    // When
    const { getByTestId } = render(<TrackCardBadgeComponent fromFcPlus type={undefined} />);

    // Then
    expect(() => getByTestId('badge')).toThrow();
  });
});

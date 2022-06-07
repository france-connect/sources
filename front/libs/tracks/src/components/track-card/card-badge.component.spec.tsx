import { render } from '@testing-library/react';

import { TrackCardBadgeComponent } from './card-badge.component';

describe('TrackCardBadgeComponent', () => {
  it('should always render a FranceConnect badge', () => {
    // given
    const { getByText } = render(<TrackCardBadgeComponent fromFcPlus={false} type="FC_VERIFIED" />);
    // when
    const element = getByText('FranceConnect');
    // then
    expect(element).toBeInTheDocument();
    expect(element.parentElement).toHaveClass('fr-badge--blue-france-connect');
    expect(element.parentElement).not.toHaveClass('fr-badge--blue-france-connect-plus');
  });

  it('render a FranceConnectPlus badge', () => {
    // given
    const { getByText } = render(<TrackCardBadgeComponent fromFcPlus type="FC_VERIFIED" />);
    // when
    const element = getByText('FranceConnect+');
    // then
    expect(element).toBeInTheDocument();
    expect(element.parentElement).toHaveClass('fr-badge--blue-france-connect-plus');
    expect(element.parentElement).not.toHaveClass('fr-badge--blue-france-connect');
  });

  it('should always render the FC_VERIFIED badge', () => {
    // given
    const { getByText } = render(<TrackCardBadgeComponent fromFcPlus type="FC_VERIFIED" />);
    // when
    const element = getByText('Connexion');
    // then
    expect(element).toBeInTheDocument();
  });

  it('should always render the FC_DATATRANSFER_CONSENT_IDENTITY badge', () => {
    // given
    const { getByText } = render(
      <TrackCardBadgeComponent fromFcPlus type="FC_DATATRANSFER_CONSENT_IDENTITY" />,
    );
    // when
    const element = getByText('Autorisation');
    // then
    expect(element).toBeInTheDocument();
  });

  it('should always render the FC_DATATRANSFER_CONSENT_DATA badge', () => {
    // given
    const { getByText } = render(
      <TrackCardBadgeComponent fromFcPlus type="FC_DATATRANSFER_CONSENT_DATA" />,
    );
    // when
    const element = getByText('Autorisation');
    // then
    expect(element).toBeInTheDocument();
  });

  it('should always render the DP_REQUESTED_FC_CHECKTOKEN badge', () => {
    // given
    const { getByText } = render(
      <TrackCardBadgeComponent fromFcPlus type="DP_REQUESTED_FC_CHECKTOKEN" />,
    );
    // when
    const element = getByText('Échange de Données');
    // then
    expect(element).toBeInTheDocument();
  });

  it('should not render any type badge', () => {
    // given
    const { getByTestId } = render(<TrackCardBadgeComponent fromFcPlus type={undefined} />);
    // then
    expect(() => getByTestId('badge')).toThrow();
  });
});

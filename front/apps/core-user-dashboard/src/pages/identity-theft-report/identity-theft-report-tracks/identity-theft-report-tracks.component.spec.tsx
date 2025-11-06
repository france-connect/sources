import { render } from '@testing-library/react';

import { t } from '@fc/i18n';

import { TrackCardComponent } from '../../../components/track-card';
import type { TrackInterface } from '../../../interfaces';
import { IdentityTheftReportTracksComponent } from './identity-theft-report-tracks.component';

jest.mock('../../../components/track-card/track-card.component');

describe('IdentityTheftReportTracksComponent', () => {
  // Given
  const codeMock = 'any-acme-code-mock';
  const tracksMock = [
    { trackId: '1234' } as unknown as TrackInterface,
    { trackId: '5678' } as unknown as TrackInterface,
  ];

  it('should match snapshot', () => {
    // When
    const { container } = render(
      <IdentityTheftReportTracksComponent code={codeMock} tracks={tracksMock} />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render the title', () => {
    // Given
    jest.mocked(t).mockReturnValueOnce('any-i18n-title-mock');

    // When
    const { getByText } = render(
      <IdentityTheftReportTracksComponent code={codeMock} tracks={tracksMock} />,
    );
    const titleElt = getByText('any-i18n-title-mock');

    // Then
    expect(titleElt).toBeInTheDocument();
    expect(t).toHaveBeenCalledExactlyOnceWith('IdentityTheftReport.tracks.title');
  });

  it('should render the code', () => {
    // When
    const { getByText } = render(
      <IdentityTheftReportTracksComponent code={codeMock} tracks={tracksMock} />,
    );
    const codeElt = getByText(codeMock);

    // Then
    expect(codeElt).toBeInTheDocument();
  });

  it('should render the tracks', () => {
    // When
    render(<IdentityTheftReportTracksComponent code={codeMock} tracks={tracksMock} />);

    // Then
    expect(TrackCardComponent).toHaveBeenCalledTimes(2);
    expect(TrackCardComponent).toHaveBeenNthCalledWith(1, { track: tracksMock[0] }, undefined);
    expect(TrackCardComponent).toHaveBeenNthCalledWith(2, { track: tracksMock[1] }, undefined);
  });
});

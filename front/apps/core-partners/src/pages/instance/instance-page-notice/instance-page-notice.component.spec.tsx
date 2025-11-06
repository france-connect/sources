import { render } from '@testing-library/react';

import { MessageTypes } from '@fc/common';
import { ConfigService } from '@fc/config';
import { AlertComponent, Sizes } from '@fc/dsfr';
import { SeeAlsoElement } from '@fc/forms';
import { t } from '@fc/i18n';

import { InstancePageNoticeComponent } from './instance-page-notice.component';

describe('InstancePageNoticeComponent', () => {
  beforeEach(() => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValue({
      configurationSandboxAddressDocUrl: 'https://example.com/docs',
    });
  });

  it('should match the snapshot', () => {
    // When
    const { container } = render(<InstancePageNoticeComponent />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call ConfigService.get with parameters', () => {
    // When
    render(<InstancePageNoticeComponent />);

    // Then
    expect(ConfigService.get).toHaveBeenCalledExactlyOnceWith('ExternalUrls');
  });

  it('should render AlertComponent with parameters', () => {
    // When
    render(<InstancePageNoticeComponent />);

    // Then
    expect(AlertComponent).toHaveBeenCalledOnce();
    expect(AlertComponent).toHaveBeenCalledWith(
      {
        children: expect.any(Object),
        className: 'fr-col-12 fr-col-md-8 fr-mb-4w',
        size: Sizes.MEDIUM,
        type: MessageTypes.INFO,
      },
      undefined,
    );
  });

  it('should render the traansled title', () => {
    // When
    const { getByText } = render(<InstancePageNoticeComponent />);

    // Then
    expect(t).toHaveBeenCalledWith('CorePartners.instance.noticeTitle');
    expect(getByText('CorePartners.instance.noticeTitle')).toBeInTheDocument();
  });

  it('should render SeeAlsoElement with parameters', () => {
    // When
    render(<InstancePageNoticeComponent />);

    // Then
    expect(SeeAlsoElement).toHaveBeenCalledOnce();
    expect(SeeAlsoElement).toHaveBeenCalledWith(
      {
        id: 'alert-partner-doc',
        url: 'https://example.com/docs',
      },
      undefined,
    );
  });
});

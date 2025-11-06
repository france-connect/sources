import { render } from '@testing-library/react';

import { AlertComponent, CalloutComponent } from '@fc/dsfr';
import { t } from '@fc/i18n';

import { ServiceProvidersPageNoticeComponent } from './service-providers-notice.component';

describe('ServiceProvidersPageNoticeComponent', () => {
  beforeEach(() => {
    // Given
    jest.mocked(t).mockReturnValue('any-i18n-translation');
  });

  it('should match snapshot when has items', () => {
    // when
    const { container } = render(<ServiceProvidersPageNoticeComponent hasItems />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot when has no items', () => {
    // when
    const { container } = render(<ServiceProvidersPageNoticeComponent hasItems={false} />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should render CalloutComponent with params when has items', () => {
    // when
    render(<ServiceProvidersPageNoticeComponent hasItems />);

    // then
    expect(CalloutComponent).toHaveBeenCalledExactlyOnceWith(
      {
        children: expect.any(Object),
        className: 'fr-mt-5w',
        dataTestId: 'service-providers-page-callout',
        icon: 'info-line',
        title: 'any-i18n-translation',
      },
      undefined,
    );
  });

  it('should render CalloutComponent with params when has no items', () => {
    // when
    render(<ServiceProvidersPageNoticeComponent hasItems={false} />);

    // then
    expect(AlertComponent).toHaveBeenCalledExactlyOnceWith(
      {
        children: expect.any(Object),
        className: 'fr-mt-5w',
        dataTestId: 'service-providers-page-callout',
        icon: 'info-line',
        title: 'any-i18n-translation',
      },
      undefined,
    );
  });

  it('should call translation 5 times with arguments', () => {
    // when
    render(<ServiceProvidersPageNoticeComponent hasItems />);

    // then
    expect(t).toHaveBeenCalledTimes(5);
    expect(t).toHaveBeenNthCalledWith(1, 'CorePartners.serviceProvidersPage.calloutTitle');
    expect(t).toHaveBeenNthCalledWith(2, 'CorePartners.serviceProvidersPage.calloutSubtitle');
    expect(t).toHaveBeenNthCalledWith(3, 'CorePartners.serviceProvidersPage.calloutBullet1');
    expect(t).toHaveBeenNthCalledWith(4, 'CorePartners.serviceProvidersPage.calloutBullet2');
    expect(t).toHaveBeenNthCalledWith(5, 'CorePartners.serviceProvidersPage.calloutBullet3');
  });
});

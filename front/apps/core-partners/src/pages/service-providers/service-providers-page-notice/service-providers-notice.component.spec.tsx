import { render } from '@testing-library/react';

import { AlertComponent, CalloutComponent } from '@fc/dsfr';

import { ServiceProvidersPageNoticeComponent } from './service-providers-notice.component';

describe('ServiceProvidersPageNoticeComponent', () => {
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
        dataTestId: 'service-providers-page-notice-callout',
        icon: 'info-line',
        title: 'CorePartners.serviceProvidersPage.noticeTitle',
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
        dataTestId: 'service-providers-page-notice-alert',
        icon: 'info-line',
        title: 'CorePartners.serviceProvidersPage.noticeTitle',
      },
      undefined,
    );
  });
});

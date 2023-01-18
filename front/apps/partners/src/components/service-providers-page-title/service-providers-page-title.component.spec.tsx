import { render } from '@testing-library/react';

import { t } from '@fc/i18n';

import { ServiceProvidersPageTitleComponent } from './service-providers-page-title.component';

jest.mock('@fc/i18n');
jest.mock('react-redux');

describe('ServiceProvidersPageTitleComponent', () => {
  it('should match the snapshot', () => {
    // when
    const { container } = render(
      <ServiceProvidersPageTitleComponent totalItems={expect.any(Number)} />,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should call t with params', () => {
    // when
    render(<ServiceProvidersPageTitleComponent totalItems={3000} />);

    // then
    expect(t).toHaveBeenCalledTimes(1);
    expect(t).toHaveBeenCalledWith('ServiceProvidersPage.title', {
      count: 3000,
    });
  });
});

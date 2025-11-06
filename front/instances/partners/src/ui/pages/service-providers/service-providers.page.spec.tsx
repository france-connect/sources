import { render } from '@testing-library/react';

import {
  ServiceProvidersListComponent,
  ServiceProvidersPageNoticeComponent,
} from '@fc/core-partners';
import { t } from '@fc/i18n';
import type { ServiceProviderInterface } from '@fc/partners-service-providers';

import { useServiceProviders } from '../../../hooks';
import { ServiceProvidersPage } from './service-providers.page';

jest.mock('../../../hooks/service-providers/service-providers.hook');

describe('ServiceProvidersPage', () => {
  beforeEach(() => {
    // Given
    jest.mocked(useServiceProviders).mockReturnValue({
      hasItems: false,
      items: [],
    });
  });

  it('should match snapshot', () => {
    // when
    const { container } = render(<ServiceProvidersPage />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should render the page title', () => {
    // when
    render(<ServiceProvidersPage />);

    // then
    expect(t).toHaveBeenCalledExactlyOnceWith('CorePartners.serviceProvidersPage.title');
  });

  it('should call useServiceProviders hook', () => {
    // when
    render(<ServiceProvidersPage />);

    // then
    expect(useServiceProviders).toHaveBeenCalledExactlyOnceWith();
  });

  it('should render ServiceProvidersPageNoticeComponent', () => {
    // Given
    const hasItemsMock = Symbol('any-has-items-mock') as unknown as boolean;

    jest.mocked(useServiceProviders).mockReturnValueOnce({
      hasItems: hasItemsMock,
      items: [],
    });

    // when
    render(<ServiceProvidersPage />);

    // then
    expect(ServiceProvidersPageNoticeComponent).toHaveBeenCalledExactlyOnceWith(
      {
        hasItems: hasItemsMock,
      },
      undefined,
    );
  });

  it('should not render ServiceProvidersListComponent when hasItems is false', () => {
    // when
    render(<ServiceProvidersPage />);

    // then
    expect(ServiceProvidersListComponent).not.toHaveBeenCalled();
  });

  it('should render ServiceProvidersListComponent when hasItems is true', () => {
    // Given
    const itemsMock = [
      Symbol('any-service-provider-mock1'),
      Symbol('any-service-provider-mock2'),
    ] as unknown as ServiceProviderInterface[];
    jest.mocked(useServiceProviders).mockReturnValueOnce({
      hasItems: true,
      items: itemsMock,
    });

    // when
    render(<ServiceProvidersPage />);

    // then
    expect(ServiceProvidersListComponent).toHaveBeenCalledExactlyOnceWith({
      items: itemsMock,
    });
  });
});

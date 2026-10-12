import { render } from '@testing-library/react';

import { t } from '@fc/i18n';

import { ServiceProviderLinkInstancesPageHeaderComponent } from './service-provider-link-instances-page-header.component';

describe('ServiceProviderLinkInstancesPageHeaderComponent', () => {
  it('should match the snapshot', () => {
    // When
    const { container } = render(
      <ServiceProviderLinkInstancesPageHeaderComponent serviceProviderName="any-sp-name-mock" />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render title and description', () => {
    // When
    render(
      <ServiceProviderLinkInstancesPageHeaderComponent serviceProviderName="any-sp-name-mock" />,
    );

    // Then
    expect(t).toHaveBeenCalledWith('Partners.linkInstances.title');
    expect(t).toHaveBeenCalledWith('Partners.linkInstances.description', {
      serviceProviderName: 'any-sp-name-mock',
    });
  });

  it('should default serviceProviderName to an empty string', () => {
    // When
    render(<ServiceProviderLinkInstancesPageHeaderComponent />);

    // Then
    expect(t).toHaveBeenCalledWith('Partners.linkInstances.description', {
      serviceProviderName: '',
    });
  });
});

import { render } from '@testing-library/react';

import { BadgeComponent } from '@fc/dsfr';

import { ServiceProviderHeaderComponent } from './service-provider-header.component';

jest.mock('@fc/dsfr');
describe('ServiceProvidersDetailsHeaderComponent', () => {
  const ServiceProviderMock = {
    color: 'yellow-tournesol',
    platformName: 'FranceConnect',
    spName: 'Service Provider - Sandbox',
    status: 'en intégration',
  };

  it('should match the snapshot', () => {
    // when
    const { container } = render(<ServiceProviderHeaderComponent item={ServiceProviderMock} />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should display service provider name', () => {
    // when
    const { getByText } = render(<ServiceProviderHeaderComponent item={ServiceProviderMock} />);

    // then
    const element = getByText(`${ServiceProviderMock.spName}`);
    expect(element).toBeInTheDocument();
  });

  it('should display service provider platform', () => {
    // when
    const { getByText } = render(<ServiceProviderHeaderComponent item={ServiceProviderMock} />);

    // then
    const element = getByText(ServiceProviderMock.platformName);
    expect(element).toBeInTheDocument();
  });

  it('should call BadgeComponent', () => {
    // when
    render(<ServiceProviderHeaderComponent item={ServiceProviderMock} />);

    // then
    expect(BadgeComponent).toHaveBeenCalled();
  });

  it('should call BadgeComponent with props', () => {
    // when
    render(<ServiceProviderHeaderComponent item={ServiceProviderMock} />);

    // then
    expect(BadgeComponent).toHaveBeenCalledTimes(1);
    expect(BadgeComponent).toHaveBeenCalledWith(
      {
        colorName: ServiceProviderMock.color,
        dataTestId: 'ServiceProviderHeaderComponent-badge',
        label: ServiceProviderMock.status,
        noIcon: true,
        size: 'md',
      },
      {},
    );
  });
});

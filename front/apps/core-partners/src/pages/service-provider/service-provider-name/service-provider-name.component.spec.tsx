import { render } from '@testing-library/react';

import { ServiceProviderNameComponent } from './service-provider-name.component';

describe('ServiceProviderNameComponent', () => {
  // Given
  const nameMock = 'Service Provider Name Mock';
  const organizationNameMock = 'Organization Name Mock';

  it('should match the snapshot', () => {
    // When
    const { container } = render(
      <ServiceProviderNameComponent name={nameMock} organizationName={organizationNameMock} />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render the service provider name in an h1 element', () => {
    // When
    const { getByText } = render(
      <ServiceProviderNameComponent name={nameMock} organizationName={organizationNameMock} />,
    );
    const elt = getByText('Service Provider Name Mock');

    // Then
    expect(elt).toBeInTheDocument();
  });

  it('should render the organization name', () => {
    // When
    const { getByTestId } = render(
      <ServiceProviderNameComponent name={nameMock} organizationName={organizationNameMock} />,
    );

    // Then
    const element = getByTestId('service-provider-details-page-organization-name');

    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('Organization Name Mock');
    expect(element).toHaveClass('is-uppercase');
  });
});

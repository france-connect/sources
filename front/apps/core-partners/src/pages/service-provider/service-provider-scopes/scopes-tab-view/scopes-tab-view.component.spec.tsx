import { render } from '@testing-library/react';

import { ServiceProviderScopesTabViewComponent } from './scopes-tab-view.component';

describe('ServiceProviderScopesTabViewComponent', () => {
  // Given
  const scopesMock = ['scope-1', 'scope-2'];

  it('should match the snapshot', () => {
    // When
    const { container } = render(
      <ServiceProviderScopesTabViewComponent id="fc" scopes={scopesMock} />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render each scope in a list item', () => {
    // When
    const { getByText } = render(
      <ServiceProviderScopesTabViewComponent id="fc" scopes={scopesMock} />,
    );

    // Then
    expect(getByText('scope-1')).toBeInTheDocument();
    expect(getByText('scope-2')).toBeInTheDocument();
  });

  it('should render data-testid for each scope item', () => {
    // When
    const { getByTestId } = render(
      <ServiceProviderScopesTabViewComponent id="fc" scopes={scopesMock} />,
    );

    // Then
    expect(getByTestId('service-provider-scopes-tab-fc-scope-0')).toHaveTextContent('scope-1');
    expect(getByTestId('service-provider-scopes-tab-fc-scope-1')).toHaveTextContent('scope-2');
  });

  it('should render an empty list when scopes is empty', () => {
    // When
    const { container } = render(
      <ServiceProviderScopesTabViewComponent id="datapass" scopes={[]} />,
    );

    // Then
    expect(container.querySelectorAll('li')).toHaveLength(0);
  });
});

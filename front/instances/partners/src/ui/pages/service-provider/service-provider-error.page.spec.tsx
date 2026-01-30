import { render } from '@testing-library/react';

import { ServiceProviderErrorPage } from './service-provider-error.page';

describe('ServiceProviderErrorPage', () => {
  it('should match snapshot', () => {
    // When
    const { container } = render(<ServiceProviderErrorPage />);

    // Then
    expect(container).toMatchSnapshot();
  });
});

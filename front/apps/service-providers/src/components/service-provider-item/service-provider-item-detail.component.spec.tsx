import { render } from '@testing-library/react';

import { ServiceProviderItemDetailComponent } from './service-provider-item-detail.component';

describe('ServiceProviderItemDetailComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should match the snapshot with default values', () => {
    // when
    const { container } = render(
      <ServiceProviderItemDetailComponent label="Nom du service provider" />,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot with lastItem set to true', () => {
    // when
    const { container } = render(
      <ServiceProviderItemDetailComponent lastItem label="Nom du service provider" />,
    );

    // then
    expect(container).toMatchSnapshot();
  });
});

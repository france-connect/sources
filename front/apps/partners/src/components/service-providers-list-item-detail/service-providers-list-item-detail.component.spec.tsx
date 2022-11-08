import { render } from '@testing-library/react';

import { ServiceProvidersListItemDetailComponent } from './service-providers-list-item-detail.component';

describe('ServiceProvidersListItemDetailComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should match the snapshot with default values', () => {
    // when
    const { container } = render(
      <ServiceProvidersListItemDetailComponent label="Nom du service provider" />,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot with lastItem set to true', () => {
    // when
    const { container } = render(
      <ServiceProvidersListItemDetailComponent lastItem label="Nom du service provider" />,
    );

    // then
    expect(container).toMatchSnapshot();
  });
});

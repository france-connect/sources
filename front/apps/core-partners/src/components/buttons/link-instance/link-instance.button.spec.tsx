import { render } from '@testing-library/react';

import { LinkButton } from '@fc/dsfr';

import { LinkInstancesButton } from './link-instance.button';

describe('LinkInstancesButton', () => {
  it('should match the snapshot', () => {
    // When
    const { container } = render(<LinkInstancesButton />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call LinkButton with parameters', () => {
    // When
    render(<LinkInstancesButton />);

    // Then
    expect(LinkButton).toHaveBeenCalledExactlyOnceWith(
      {
        children: 'CorePartners.serviceProviderPage.linkInstances.button',
        dataTestId: 'service-provider-link-instances-button',
        icon: 'links-line',
        iconPlacement: 'left',
        link: 'link-instances',
        priority: 'secondary',
      },
      undefined,
    );
  });
});

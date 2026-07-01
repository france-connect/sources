import { render } from '@testing-library/react';

import { LinkButton } from '@fc/dsfr';

import { CreateLinkedInstanceButton } from './create-linked-instance.button';

describe('CreateLinkedInstanceButton', () => {
  it('should match the snapshot', () => {
    // When
    const { container } = render(<CreateLinkedInstanceButton />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call LinkButton with parameters', () => {
    // When
    render(<CreateLinkedInstanceButton />);

    // Then
    expect(LinkButton).toHaveBeenCalledExactlyOnceWith(
      {
        children: 'CorePartners.serviceProviderPage.createLinkedInstance.button',
        dataTestId: 'CreateLinkedInstanceButton',
        icon: 'add-line',
        iconPlacement: 'left',
        link: 'creer-instance',
        noOutline: true,
        priority: 'primary',
      },
      undefined,
    );
  });
});

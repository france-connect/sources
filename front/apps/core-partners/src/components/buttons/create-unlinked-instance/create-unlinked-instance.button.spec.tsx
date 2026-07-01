import { render } from '@testing-library/react';

import { LinkButton } from '@fc/dsfr';

import { CreateUnlinkedInstanceButton } from './create-unlinked-instance.button';

describe('CreateUnlinkedInstanceButton', () => {
  it('should match the snapshot', () => {
    // When
    const { container } = render(<CreateUnlinkedInstanceButton />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call t with the correct key', () => {
    // When
    render(<CreateUnlinkedInstanceButton />);

    // Then
    expect(LinkButton).toHaveBeenCalledExactlyOnceWith(
      {
        children: 'CorePartners.instancesPage.createUnlinkedInstance.button',
        dataTestId: 'CreateUnlinkedInstanceButton',
        icon: 'add-line',
        iconPlacement: 'left',
        link: 'creer-instance',
        noOutline: true,
        priority: 'tertiary',
      },
      undefined,
    );
  });
});

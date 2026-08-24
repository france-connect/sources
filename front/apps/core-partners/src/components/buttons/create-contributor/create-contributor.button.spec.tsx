import { render } from '@testing-library/react';

import { LinkButton } from '@fc/dsfr';

import { CreateContributorButton } from './create-contributor.button';

describe('CreateContributorButton', () => {
  it('should match the snapshot', () => {
    // When
    const { container } = render(<CreateContributorButton />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render the LinkButton with parameters', () => {
    // When
    render(<CreateContributorButton />);

    // Then
    expect(LinkButton).toHaveBeenCalledOnce();
    expect(LinkButton).toHaveBeenCalledWith(
      {
        children: 'Partners.serviceProviderPage.usersSection.contributorCreate.button',
        dataTestId: 'service-provider-create-contributor-button',
        icon: 'user-add-line',
        iconPlacement: 'left',
        link: 'ajouter-contributeur',
      },
      undefined,
    );
  });
});

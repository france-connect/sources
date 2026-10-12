import { render } from '@testing-library/react';

import { IconPlacement, Priorities, SimpleButton } from '@fc/dsfr';
import { t } from '@fc/i18n';

import type { ServiceProviderPermissionInterface } from '../../../interfaces';
import { DeleteContributorButton } from './delete-contributor.button';

describe('DeleteContributorButton', () => {
  // Given
  const permissionMock = {
    account: { email: 'any-email-mock', id: 'any-account-id-mock' },
  } as ServiceProviderPermissionInterface;

  const onDeleteMock = jest.fn();

  const renderButton = () => {
    let buttonProps = {} as { onClick: () => void };

    jest.mocked(SimpleButton).mockImplementationOnce((props) => {
      buttonProps = props as { onClick: () => void };
      return <div>SimpleButton</div>;
    });

    render(<DeleteContributorButton permission={permissionMock} onDelete={onDeleteMock} />);

    return buttonProps;
  };

  it('should match the snapshot', () => {
    // When
    const { container } = render(
      <DeleteContributorButton permission={permissionMock} onDelete={onDeleteMock} />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should name the contributor into the accessible name of the button', () => {
    // When
    render(<DeleteContributorButton permission={permissionMock} onDelete={onDeleteMock} />);

    // Then
    expect(t).toHaveBeenCalledWith(
      'Partners.serviceProviderPage.usersSection.deleteButton.ariaLabel',
      {
        email: 'any-email-mock',
      },
    );
  });

  it('should render the SimpleButton with parameters', () => {
    // When
    render(<DeleteContributorButton permission={permissionMock} onDelete={onDeleteMock} />);

    // Then
    expect(SimpleButton).toHaveBeenCalledExactlyOnceWith(
      {
        ariaLabel: 'Partners.serviceProviderPage.usersSection.deleteButton.ariaLabel',
        children: 'FC.Common.delete',
        dataTestId: 'service-provider-permissions--delete-any-account-id-mock',
        icon: 'delete-line',
        iconPlacement: IconPlacement.LEFT,
        onClick: expect.any(Function),
        priority: Priorities.SECONDARY,
      },
      undefined,
    );
  });

  it('should delete the contributor of the button when it is clicked', () => {
    // Given
    const { onClick } = renderButton();

    // When
    onClick();

    // Then
    expect(onDeleteMock).toHaveBeenCalledExactlyOnceWith(permissionMock);
  });
});

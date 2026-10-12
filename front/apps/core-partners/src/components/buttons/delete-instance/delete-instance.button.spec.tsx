import { render } from '@testing-library/react';

import { IconPlacement, Priorities, SimpleButton } from '@fc/dsfr';
import { t } from '@fc/i18n';

import type { InstanceInterface } from '../../../interfaces';
import { DeleteInstanceButton } from './delete-instance.button';

describe('DeleteInstanceButton', () => {
  // Given
  const instanceMock = {
    currentVersion: { data: { name: 'any-instance-name-mock' } },
    id: 'any-instance-id-mock',
  } as InstanceInterface;

  const onDeleteMock = jest.fn();

  const renderButton = () => {
    let buttonProps = {} as { onClick: () => void };

    jest.mocked(SimpleButton).mockImplementationOnce((props) => {
      buttonProps = props as { onClick: () => void };
      return <div>SimpleButton</div>;
    });

    render(<DeleteInstanceButton instance={instanceMock} onDelete={onDeleteMock} />);

    return buttonProps;
  };

  it('should match the snapshot', () => {
    // When
    const { container } = render(
      <DeleteInstanceButton instance={instanceMock} onDelete={onDeleteMock} />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should name the sandbox into the accessible name of the button', () => {
    // When
    render(<DeleteInstanceButton instance={instanceMock} onDelete={onDeleteMock} />);

    // Then
    expect(t).toHaveBeenCalledWith(
      'Partners.serviceProviderPage.sandboxes.deleteButton.ariaLabel',
      {
        instanceName: 'any-instance-name-mock',
      },
    );
  });

  it('should render the SimpleButton with parameters', () => {
    // When
    render(<DeleteInstanceButton instance={instanceMock} onDelete={onDeleteMock} />);

    // Then
    expect(SimpleButton).toHaveBeenCalledExactlyOnceWith(
      {
        ariaLabel: 'Partners.serviceProviderPage.sandboxes.deleteButton.ariaLabel',
        children: 'FC.Common.delete',
        dataTestId: 'service-provider-sandboxes-table--delete-any-instance-id-mock',
        icon: 'delete-line',
        iconPlacement: IconPlacement.LEFT,
        onClick: expect.any(Function),
        priority: Priorities.SECONDARY,
      },
      undefined,
    );
  });

  it('should delete the sandbox of the button when it is clicked', () => {
    // Given
    const { onClick } = renderButton();

    // When
    onClick();

    // Then
    expect(onDeleteMock).toHaveBeenCalledExactlyOnceWith(instanceMock);
  });
});

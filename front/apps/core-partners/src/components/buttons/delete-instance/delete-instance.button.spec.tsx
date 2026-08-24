import { render } from '@testing-library/react';

import { IconPlacement, Priorities, SimpleButton } from '@fc/dsfr';
import { t } from '@fc/i18n';

import { useDeleteInstanceButton } from '../../../hooks';
import type { InstanceInterface } from '../../../interfaces';
import { DeleteInstanceButton } from './delete-instance.button';

jest.mock('../../../hooks/delete-instance-button/delete-instance-button.hook');

describe('DeleteInstanceButton', () => {
  // Given
  const instanceMock = {
    currentVersion: { data: { name: 'any-instance-name-mock' } },
    id: 'any-instance-id-mock',
  } as unknown as InstanceInterface;

  const onDeleteMock = jest.fn();
  const handleDeleteMock = jest.fn();

  beforeEach(() => {
    // Given
    jest.mocked(useDeleteInstanceButton).mockReturnValue({ handleDelete: handleDeleteMock });
  });

  it('should match the snapshot', () => {
    // When
    const { container } = render(
      <DeleteInstanceButton instance={instanceMock} onDelete={onDeleteMock} />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call useDeleteInstanceButton with the instance and the deletion callback', () => {
    // When
    render(<DeleteInstanceButton instance={instanceMock} onDelete={onDeleteMock} />);

    // Then
    expect(useDeleteInstanceButton).toHaveBeenCalledExactlyOnceWith({
      instance: instanceMock,
      onDelete: onDeleteMock,
    });
  });

  it('should name the instance into the accessible name of the button', () => {
    // When
    render(<DeleteInstanceButton instance={instanceMock} onDelete={onDeleteMock} />);

    // Then
    expect(t).toHaveBeenCalledWith(
      'Partners.serviceProviderPage.sandboxes.deleteButton.ariaLabel',
      { instanceName: 'any-instance-name-mock' },
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
        onClick: handleDeleteMock,
        priority: Priorities.SECONDARY,
      },
      undefined,
    );
  });
});

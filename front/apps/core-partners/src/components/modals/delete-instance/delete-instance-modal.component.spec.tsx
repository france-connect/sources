import { render } from '@testing-library/react';

import { t } from '@fc/i18n';

import { DeleteInstanceModalComponent } from './delete-instance-modal.component';

describe('DeleteInstanceModalComponent', () => {
  it('should match the snapshot', () => {
    // When
    const { container } = render(
      <DeleteInstanceModalComponent instanceName="any-instance-name-mock" />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should name the instance into the description', () => {
    // When
    render(<DeleteInstanceModalComponent instanceName="any-instance-name-mock" />);

    // Then
    expect(t).toHaveBeenCalledExactlyOnceWith(
      'Partners.serviceProviderPage.sandboxes.deleteModal.description',
      { instanceName: 'any-instance-name-mock' },
    );
  });
});

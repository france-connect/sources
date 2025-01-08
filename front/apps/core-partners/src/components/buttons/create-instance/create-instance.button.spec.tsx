import { render } from '@testing-library/react';

import { LinkButton } from '@fc/dsfr';
import { t } from '@fc/i18n';

import { CreateInstanceButton } from './create-instance.button';

describe('CreateButton', () => {
  it('should match the snapshot', () => {
    // Given
    jest.mocked(t).mockReturnValueOnce('any-i18n-mock');

    // When
    const { container } = render(<CreateInstanceButton />);

    // Then
    expect(container).toMatchSnapshot();
    expect(LinkButton).toHaveBeenCalledOnce();
    expect(LinkButton).toHaveBeenCalledWith(
      {
        children: 'any-i18n-mock',
        dataTestId: 'CreateInstanceButton',
        icon: 'add-line',
        iconPlacement: 'left',
        link: 'create',
        noOutline: true,
        priority: 'tertiary',
      },
      {},
    );
    expect(t).toHaveBeenCalledOnce();
    expect(t).toHaveBeenCalledWith('Partners.button.createInstance');
  });
});

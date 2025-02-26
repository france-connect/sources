import { render } from '@testing-library/react';

import { SimpleButton } from '@fc/dsfr';
import { t } from '@fc/i18n';

import { ArrayRemoveButton } from './array-remove.button';

describe('ArrayRemoveButton', () => {
  it('should match the snapshot', () => {
    // Given
    const onClickMock = jest.fn();
    jest
      .mocked(t)
      .mockReturnValueOnce('Form.multiple.remove')
      .mockReturnValueOnce('Form.multiple.remove');

    // When
    const { container } = render(
      <ArrayRemoveButton dataTestId="any-data-testid-mock" onClick={onClickMock} />,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(SimpleButton).toHaveBeenCalledOnce();
    expect(SimpleButton).toHaveBeenCalledWith(
      {
        children: 'Form.multiple.remove',
        className: 'fr-ml-2v',
        dataTestId: 'any-data-testid-mock',
        disabled: false,
        hideLabel: true,
        icon: 'delete-line',
        onClick: onClickMock,
        priority: 'tertiary',
        title: 'Form.multiple.remove',
      },
      {},
    );
    expect(t).toHaveBeenCalledTimes(2);
    expect(t).toHaveBeenNthCalledWith(1, 'Form.multiple.remove');
    expect(t).toHaveBeenNthCalledWith(2, 'Form.multiple.remove');
  });

  it('should match the snapshot, when the button is disabled', () => {
    // Given
    const onClickMock = jest.fn();

    // When
    const { container } = render(<ArrayRemoveButton disabled onClick={onClickMock} />);

    // Then
    expect(container).toMatchSnapshot();
    expect(SimpleButton).toHaveBeenCalledOnce();
    expect(SimpleButton).toHaveBeenCalledWith(
      {
        children: 'Form.multiple.remove',
        className: 'fr-ml-2v',
        disabled: true,
        hideLabel: true,
        icon: 'delete-line',
        onClick: onClickMock,
        priority: 'tertiary',
        title: 'Form.multiple.remove',
      },
      {},
    );
    expect(t).toHaveBeenCalledTimes(2);
    expect(t).toHaveBeenNthCalledWith(1, 'Form.multiple.remove');
    expect(t).toHaveBeenNthCalledWith(2, 'Form.multiple.remove');
  });
});

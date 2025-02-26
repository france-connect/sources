import { render } from '@testing-library/react';

import { SimpleButton } from '@fc/dsfr';
import { t } from '@fc/i18n';

import { ArrayAddButton } from './array-add.button';

describe('ArrayAddButton', () => {
  it('should match the snapshot', () => {
    // Given
    const onClickMock = jest.fn();
    jest
      .mocked(t)
      .mockReturnValueOnce('Form.multiple.add')
      .mockReturnValueOnce('Form.multiple.add');

    // When
    const { container } = render(
      <ArrayAddButton dataTestId="any-data-testid-mock" onClick={onClickMock} />,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(SimpleButton).toHaveBeenCalledOnce();
    expect(SimpleButton).toHaveBeenCalledWith(
      {
        children: 'Form.multiple.add',
        className: 'fr-mt-2v',
        dataTestId: 'any-data-testid-mock',
        disabled: false,
        icon: 'add-line',
        iconPlacement: 'left',
        onClick: onClickMock,
        priority: 'tertiary',
        title: 'Form.multiple.add',
      },
      {},
    );
    expect(t).toHaveBeenCalledTimes(2);
    expect(t).toHaveBeenNthCalledWith(1, 'Form.multiple.add');
    expect(t).toHaveBeenNthCalledWith(2, 'Form.multiple.add');
  });

  it('should match the snapshot, when the button is disabled', () => {
    // Given
    const onClickMock = jest.fn();

    // When
    const { container } = render(<ArrayAddButton disabled onClick={onClickMock} />);

    // Then
    expect(container).toMatchSnapshot();
    expect(SimpleButton).toHaveBeenCalledOnce();
    expect(SimpleButton).toHaveBeenCalledWith(
      {
        children: 'Form.multiple.add',
        className: 'fr-mt-2v',
        disabled: true,
        icon: 'add-line',
        iconPlacement: 'left',
        onClick: onClickMock,
        priority: 'tertiary',
        title: 'Form.multiple.add',
      },
      {},
    );
    expect(t).toHaveBeenCalledTimes(2);
    expect(t).toHaveBeenNthCalledWith(1, 'Form.multiple.add');
    expect(t).toHaveBeenNthCalledWith(2, 'Form.multiple.add');
  });
});

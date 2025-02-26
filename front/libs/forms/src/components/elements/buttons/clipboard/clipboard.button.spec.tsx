import { render } from '@testing-library/react';

import { Priorities, SimpleButton } from '@fc/dsfr';
import { t } from '@fc/i18n';

import { ClipboardButton } from './clipboard.button';

describe('ClipboardButton', () => {
  it('should match the snapshot', () => {
    // Given
    const disabledMock = Symbol('any-disabled-mock') as unknown as boolean;
    const onClickMock = jest.fn();
    jest
      .mocked(t)
      .mockReturnValueOnce('any-copy-label-mock-1')
      .mockReturnValueOnce('any-copy-label-mock-2');

    // When
    const { container } = render(
      <ClipboardButton
        dataTestId="any-data-testid"
        disabled={disabledMock}
        onClick={onClickMock}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(t).toHaveBeenCalledTimes(2);
    expect(t).toHaveBeenNthCalledWith(1, 'Form.button.copy');
    expect(t).toHaveBeenNthCalledWith(2, 'Form.button.copy');
    expect(SimpleButton).toHaveBeenCalledOnce();
    expect(SimpleButton).toHaveBeenCalledWith(
      {
        children: 'any-copy-label-mock-2',
        className: 'fr-ml-2v',
        dataTestId: 'any-data-testid',
        disabled: disabledMock,
        onClick: onClickMock,
        priority: Priorities.SECONDARY,
        title: 'any-copy-label-mock-1',
      },
      {},
    );
  });

  it('should match the snapshot, when disabled is not defined', () => {
    // Given
    const onClickMock = jest.fn();

    // When
    const { container } = render(
      <ClipboardButton dataTestId="any-data-testid" onClick={onClickMock} />,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(SimpleButton).toHaveBeenCalledOnce();
    expect(SimpleButton).toHaveBeenCalledWith(
      expect.objectContaining({
        disabled: false,
      }),
      {},
    );
  });
});

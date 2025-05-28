import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import type { FieldInputProps } from 'react-final-form';

import { useClipboard } from '@fc/common';

import { ClipboardButton } from '../../../elements';
import { InputComponent } from '../../input';
import { InputWithClipboard } from './with-clipboard.input';

jest.mock('../../input/input.component');
jest.mock('../../../elements/buttons/clipboard/clipboard.button');

describe('InputWithClipboard', () => {
  // Given
  const inputMock = {
    name: 'any-name-mock',
    value: 'any-value-mock',
  } as unknown as FieldInputProps<string, HTMLElement>;

  it('should match snapshot', () => {
    // Given
    const onClickHandlerMock = jest.fn();
    jest.spyOn(React, 'useCallback').mockReturnValueOnce(onClickHandlerMock);

    // When
    const { container } = render(
      <InputWithClipboard
        className="any-className-mock"
        id="any-id-mock"
        input={inputMock}
        inputClassname="any-inputClassname-mock"
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(useClipboard).toHaveBeenCalledOnce();
    expect(useClipboard).toHaveBeenCalledWith();
    expect(InputComponent).toHaveBeenCalledOnce();
    expect(InputComponent).toHaveBeenCalledWith(
      {
        className: 'any-inputClassname-mock withClipboard',
        id: 'any-id-mock',
        input: inputMock,
        readOnly: true,
      },
      undefined,
    );
    expect(ClipboardButton).toHaveBeenCalledOnce();
    expect(ClipboardButton).toHaveBeenCalledWith(
      {
        dataTestId: 'any-id-mock-copy-button',
        onClick: onClickHandlerMock,
      },
      undefined,
    );
  });

  it('should call onCopy from useClipboard when user click the copy button', () => {
    // Given
    const onCopyMock = jest.fn();
    jest.mocked(useClipboard).mockReturnValueOnce({
      onCopy: onCopyMock,
      onPaste: jest.fn(),
      value: 'any-pasted-value-mock',
    });
    jest
      .mocked(ClipboardButton)
      .mockImplementationOnce(({ onClick }) => <button onClick={onClick}>any-button-mock</button>);

    // When
    const { getByRole } = render(
      <InputWithClipboard
        className="any-className-mock"
        id="any-id-mock"
        input={inputMock}
        inputClassname="any-inputClassname-mock"
      />,
    );
    const buttonElt = getByRole('button');
    fireEvent.click(buttonElt);

    // Then
    expect(onCopyMock).toHaveBeenCalledOnce();
    expect(onCopyMock).toHaveBeenCalledWith('any-value-mock');
  });
});

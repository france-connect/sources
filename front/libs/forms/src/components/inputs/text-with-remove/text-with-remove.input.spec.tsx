import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { type FieldInputProps, useField } from 'react-final-form';

import { useFieldMessages, useFieldMeta } from '../../../hooks';
import type { FieldMessage } from '../../../interfaces';
import { ArrayRemoveButton, GroupElement, MessagesElement } from '../../elements';
import { InputComponent } from '../input';
import { TextWithRemoveInput } from './text-with-remove.input';

jest.mock('../input/input.component');
jest.mock('../../elements/group/group.element');
jest.mock('../../elements/label/label.element');
jest.mock('../../elements/messages/messages.element');
jest.mock('../../elements/buttons/array-remove/array-remove.button');
jest.mock('../../../hooks/field-meta/field-meta.hook');
jest.mock('../../../hooks/field-messages/field-messages.hook');

describe('TextWithRemoveInput', () => {
  // Given
  const validateMock = jest.fn();
  const onRemoveMock = jest.fn();

  const disabledMock = Symbol('disabled-mock') as unknown as boolean;
  const inputMock = {
    className: 'any-classname-mock',
    disabled: disabledMock,
    name: 'any-name-mock',
    type: 'text',
    value: 'any-input-value-mock',
  } as unknown as FieldInputProps<string, HTMLElement>;

  it('should match snapshot, with error messages', () => {
    // Given
    const metaMock = {
      error: 'any-errorMessage-mock',
      touched: false,
      value: 'any-input-value-mock',
    };
    jest.mocked(useField).mockReturnValueOnce({
      input: inputMock,
      meta: metaMock,
    });
    jest.mocked(useFieldMeta).mockReturnValueOnce({
      errorsList: ['any-error-message-mock'],
      hasError: true,
      inputClassname: 'any-input-classname-mock',
      isValid: false,
    });
    const errorMessageMock = Symbol('errorMessageMock') as unknown as FieldMessage;
    jest.mocked(useFieldMessages).mockReturnValueOnce([errorMessageMock]);

    const isRemovableMock = false;

    const useCallbackMock = jest.fn();
    jest.spyOn(React, 'useCallback').mockImplementationOnce(() => useCallbackMock);

    // When
    const { container } = render(
      <TextWithRemoveInput
        fieldName="any-fieldname-mock"
        index={0}
        isRemovable={isRemovableMock}
        validate={validateMock}
        onRemove={onRemoveMock}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(useFieldMeta).toHaveBeenCalledOnce();
    expect(useFieldMeta).toHaveBeenCalledWith(metaMock);
    expect(useFieldMessages).toHaveBeenCalledOnce();
    expect(useFieldMessages).toHaveBeenCalledWith({
      errorsList: ['any-error-message-mock'],
      isValid: false,
      messages: undefined,
    });
    expect(GroupElement).toHaveBeenCalledOnce();
    expect(GroupElement).toHaveBeenCalledWith(
      {
        children: expect.any(Object),
        className: 'any-classname-mock',
        disabled: disabledMock,
        hasError: true,
        isValid: false,
        type: 'input',
      },
      undefined,
    );
    expect(InputComponent).toHaveBeenCalledOnce();
    expect(InputComponent).toHaveBeenCalledWith(
      {
        className: 'any-input-classname-mock',
        disabled: false,
        id: 'form-input-array-any-name-mock',
        input: inputMock,
      },
      undefined,
    );
    expect(ArrayRemoveButton).toHaveBeenCalledOnce();
    expect(ArrayRemoveButton).toHaveBeenCalledWith(
      {
        dataTestId: 'any-fieldname-mock-remove',
        disabled: !isRemovableMock,
        onClick: useCallbackMock,
      },
      undefined,
    );
    expect(MessagesElement).toHaveBeenCalledOnce();
    expect(MessagesElement).toHaveBeenCalledWith(
      {
        dataTestId: 'any-name-mock-messages',
        id: 'form-input-array-any-name-mock',
        messages: [errorMessageMock],
      },
      undefined,
    );
  });

  it('should match snapshot, without messages', () => {
    // Given
    const metaMock = {
      error: undefined,
      touched: false,
      value: 'any-input-value-mock',
    };
    jest.mocked(useField).mockReturnValueOnce({
      input: inputMock,
      meta: metaMock,
    });
    jest.mocked(useFieldMeta).mockReturnValueOnce({
      errorsList: [],
      hasError: false,
      inputClassname: 'any-input-classname-mock',
      isValid: true,
    });
    jest.mocked(useFieldMessages).mockReturnValueOnce([]);

    const isRemovableMock = false;

    const useCallbackMock = jest.fn();
    jest.spyOn(React, 'useCallback').mockImplementationOnce(() => useCallbackMock);

    // When
    const { container } = render(
      <TextWithRemoveInput
        fieldName="any-fieldname-mock"
        index={0}
        isRemovable={isRemovableMock}
        validate={validateMock}
        onRemove={onRemoveMock}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(useFieldMeta).toHaveBeenCalledOnce();
    expect(useFieldMeta).toHaveBeenCalledWith(metaMock);
    expect(useFieldMessages).toHaveBeenCalledOnce();
    expect(useFieldMessages).toHaveBeenCalledWith({
      errorsList: [],
      isValid: true,
      messages: undefined,
    });
    expect(GroupElement).toHaveBeenCalledOnce();
    expect(GroupElement).toHaveBeenCalledWith(
      {
        children: expect.any(Object),
        className: 'any-classname-mock',
        disabled: disabledMock,
        hasError: false,
        isValid: true,
        type: 'input',
      },
      undefined,
    );
    expect(InputComponent).toHaveBeenCalledOnce();
    expect(InputComponent).toHaveBeenCalledWith(
      {
        className: 'any-input-classname-mock',
        disabled: false,
        id: 'form-input-array-any-name-mock',
        input: inputMock,
      },
      undefined,
    );
    expect(ArrayRemoveButton).toHaveBeenCalledOnce();
    expect(ArrayRemoveButton).toHaveBeenCalledWith(
      {
        dataTestId: 'any-fieldname-mock-remove',
        disabled: !isRemovableMock,
        onClick: useCallbackMock,
      },
      undefined,
    );
    expect(MessagesElement).not.toHaveBeenCalled();
  });

  it('should match snapshot, with config messages', () => {
    // Given
    const configMessageMock = Symbol('configMessageMock') as unknown as FieldMessage;

    const metaMock = {
      error: undefined,
      touched: false,
      value: 'any-input-value-mock',
    };
    jest.mocked(useField).mockReturnValueOnce({
      input: inputMock,
      meta: metaMock,
    });
    jest.mocked(useFieldMeta).mockReturnValueOnce({
      errorsList: [],
      hasError: false,
      inputClassname: 'any-input-classname-mock',
      isValid: true,
    });
    jest.mocked(useFieldMessages).mockReturnValueOnce([configMessageMock]);

    const isRemovableMock = false;

    const useCallbackMock = jest.fn();
    jest.spyOn(React, 'useCallback').mockImplementationOnce(() => useCallbackMock);

    // When
    const { container } = render(
      <TextWithRemoveInput
        fieldName="any-fieldname-mock"
        index={0}
        isRemovable={isRemovableMock}
        messages={[configMessageMock]}
        validate={validateMock}
        onRemove={onRemoveMock}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(useFieldMessages).toHaveBeenCalledOnce();
    expect(useFieldMessages).toHaveBeenCalledWith({
      errorsList: [],
      isValid: true,
      messages: [configMessageMock],
    });

    expect(MessagesElement).toHaveBeenCalledOnce();
    expect(MessagesElement).toHaveBeenCalledWith(
      {
        dataTestId: 'any-name-mock-messages',
        id: 'form-input-array-any-name-mock',
        messages: [configMessageMock],
      },
      undefined,
    );
  });

  it('should call onRemove with index when user click the remove button', () => {
    // Given
    const metaMock = {
      error: undefined,
      touched: false,
      value: 'any-input-value-mock',
    };
    jest.mocked(useField).mockReturnValueOnce({
      input: inputMock,
      meta: metaMock,
    });
    jest.mocked(useFieldMeta).mockReturnValueOnce({
      errorsList: [],
      hasError: false,
      inputClassname: 'any-input-classname-mock',
      isValid: true,
    });
    jest.mocked(useFieldMessages).mockReturnValueOnce([]);
    const indexMock = Symbol('index-mock') as unknown as number;

    jest.mocked(ArrayRemoveButton).mockImplementationOnce(({ onClick }) => (
      <button type="button" onClick={onClick}>
        any-remove-button-mock
      </button>
    ));

    // When
    const { getByText } = render(
      <TextWithRemoveInput
        fieldName="any-fieldname-mock"
        index={indexMock}
        validate={jest.fn()}
        onRemove={onRemoveMock}
      />,
    );
    const buttonElt = getByText('any-remove-button-mock');
    fireEvent.click(buttonElt);

    // Then
    expect(onRemoveMock).toHaveBeenCalledOnce();
    expect(onRemoveMock).toHaveBeenCalledWith(indexMock);
  });
});

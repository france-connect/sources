import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { type FieldInputProps, useField } from 'react-final-form';

import { useFieldMeta } from '../../../hooks';
import { ArrayRemoveButton, GroupElement, MessageElement } from '../../elements';
import { InputComponent } from '../input';
import { TextWithRemoveInput } from './text-with-remove.input';

jest.mock('../input/input.component');
jest.mock('../../elements/group/group.element');
jest.mock('../../elements/label/label.element');
jest.mock('../../elements/message/message.element');
jest.mock('../../elements/buttons/array-remove/array-remove.button');
jest.mock('../../../hooks/field-meta/field-meta.hook');

describe('TextWithRemoveInput', () => {
  // Given
  const isValidMock = Symbol('is-valid-mock') as unknown as boolean;
  const disabledMock = Symbol('disabled-mock') as unknown as boolean;
  const hasErrorMock = Symbol('has-error-mock') as unknown as boolean;

  const metaMock = {
    error: 'any-errorMessage-mock',
    touched: false,
    value: 'any-input-value-mock',
  };

  const inputMock = {
    className: 'any-classname-mock',
    disabled: disabledMock,
    name: 'any-name-mock',
    type: 'text',
    value: 'any-input-value-mock',
  } as unknown as FieldInputProps<string, HTMLElement>;

  beforeEach(() => {
    // Given
    jest.mocked(useField).mockReturnValue({
      input: inputMock,
      meta: metaMock,
    });
    jest.mocked(useFieldMeta).mockReturnValue({
      errorMessage: 'any-error-message-mock',
      hasError: hasErrorMock,
      inputClassname: 'any-input-classname-mock',
      isValid: isValidMock,
    });
  });

  it('should match snapshot', () => {
    // Given
    const validateMock = jest.fn();
    const onRemoveMock = jest.fn();
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
    expect(GroupElement).toHaveBeenCalledOnce();
    expect(GroupElement).toHaveBeenCalledWith(
      {
        children: expect.any(Object),
        className: 'any-classname-mock',
        disabled: disabledMock,
        hasError: hasErrorMock,
        isValid: isValidMock,
        type: 'input',
      },
      {},
    );
    expect(InputComponent).toHaveBeenCalledOnce();
    expect(InputComponent).toHaveBeenCalledWith(
      {
        className: 'any-input-classname-mock',
        disabled: false,
        id: 'form-input-array-any-name-mock',
        input: inputMock,
      },
      {},
    );
    expect(ArrayRemoveButton).toHaveBeenCalledOnce();
    expect(ArrayRemoveButton).toHaveBeenCalledWith(
      {
        dataTestId: 'any-fieldname-mock-remove',
        disabled: !isRemovableMock,
        onClick: useCallbackMock,
      },
      {},
    );
    expect(MessageElement).toHaveBeenCalledOnce();
    expect(MessageElement).toHaveBeenCalledWith(
      {
        dataTestId: 'any-name-mock-messages',
        error: 'any-error-message-mock',
        id: 'form-input-array-any-name-mock',
        isValid: isValidMock,
      },
      {},
    );
  });

  it('should call onRemove with index when user click the remove button', () => {
    // Given
    const onRemoveMock = jest.fn();
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

import { render } from '@testing-library/react';
import type { FieldMetaState } from 'react-final-form';

import { useFieldMessages, useFieldMeta } from '../../../hooks';
import type { FieldMessage } from '../../../interfaces';
import { GroupElement, LabelElement, MessagesElement } from '../../elements';
import { TextAreaInput } from './textarea.input';
import { TextAreaMaxlengthComponent } from './textarea.maxlength';

jest.mock('./textarea.maxlength');
jest.mock('../../elements/group/group.element');
jest.mock('../../elements/label/label.element');
jest.mock('../../elements/messages/messages.element');
jest.mock('../../../hooks/field-meta/field-meta.hook');
jest.mock('../../../hooks/field-messages/field-messages.hook');

describe('TextAreaInput', () => {
  // Given
  const metaMock = Symbol('meta mock') as unknown as FieldMetaState<string>;

  const inputMock = {
    onBlur: jest.fn(),
    onChange: jest.fn(),
    onFocus: jest.fn(),
  };

  it('should match the snapshot, without messages', () => {
    // Given
    jest.mocked(useFieldMeta).mockReturnValueOnce({
      errorsList: [],
      hasError: false,
      inputClassname: 'any-input-classname-mock',
      isValid: true,
    });
    jest.mocked(useFieldMessages).mockReturnValueOnce([]);

    // When
    const { container, getByTestId } = render(
      <TextAreaInput
        config={{
          hint: 'any-hint-mock',
          label: 'any-label-mock',
          maxChars: undefined,
          required: true,
        }}
        input={{
          ...inputMock,
          className: 'any-classname-mock',
          disabled: false,
          name: 'any-name-mock',
          value: 'any-value-mock',
        }}
        meta={metaMock}
      />,
    );
    const inputElt = getByTestId('form-input-textarea-testid-any-name-mock');

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
        disabled: false,
        hasError: false,
        isValid: true,
        type: 'input',
      },
      undefined,
    );
    expect(LabelElement).toHaveBeenCalledOnce();
    expect(LabelElement).toHaveBeenCalledWith(
      {
        hint: 'any-hint-mock',
        label: 'any-label-mock',
        name: 'any-name-mock',
        required: true,
      },
      undefined,
    );
    expect(inputElt).toBeInTheDocument();
    expect(inputElt).toHaveAttribute('aria-describedby', 'any-name-mock-messages');
    expect(inputElt).toHaveClass('any-input-classname-mock');
    expect(inputElt).not.toHaveAttribute('disabled');
    expect(inputElt).not.toHaveAttribute('maxLength');
    expect(inputElt).toHaveAttribute('name', 'any-name-mock');
    expect(MessagesElement).not.toHaveBeenCalled();
    expect(TextAreaMaxlengthComponent).not.toHaveBeenCalledOnce();
  });

  it('should match the snapshot when a max length is defined', () => {
    // Given
    jest.mocked(useFieldMeta).mockReturnValueOnce({
      errorsList: [],
      hasError: false,
      inputClassname: 'any-input-classname-mock',
      isValid: true,
    });
    jest.mocked(useFieldMessages).mockReturnValueOnce([]);

    // When
    const { container } = render(
      <TextAreaInput
        config={{
          hint: 'any-hint-mock',
          label: 'any-label-mock',
          maxChars: 255,
          required: true,
        }}
        input={{
          ...inputMock,
          className: 'any-classname-mock',
          disabled: false,
          name: 'any-name-mock',
          value: 'any-value-mock',
        }}
        meta={metaMock}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(TextAreaMaxlengthComponent).toHaveBeenCalledOnce();
    expect(TextAreaMaxlengthComponent).toHaveBeenCalledWith(
      {
        count: 'any-value-mock'.length,
        maxLength: 255 + 1,
      },
      undefined,
    );
  });

  it('should match the snapshot, with error messages', () => {
    // Given
    jest.mocked(useFieldMeta).mockReturnValueOnce({
      errorsList: ['any-error-message-mock'],
      hasError: true,
      inputClassname: 'any-input-classname-mock',
      isValid: false,
    });
    const errorMessageMock = Symbol('errorMessageMock') as unknown as FieldMessage;
    jest.mocked(useFieldMessages).mockReturnValueOnce([errorMessageMock]);

    // When
    const { container, getByTestId } = render(
      <TextAreaInput
        config={{
          hint: 'any-hint-mock',
          label: 'any-label-mock',
          maxChars: undefined,
          required: true,
        }}
        input={{
          ...inputMock,
          className: 'any-classname-mock',
          disabled: false,
          name: 'any-name-mock',
          value: 'any-value-mock',
        }}
        meta={metaMock}
      />,
    );
    const inputElt = getByTestId('form-input-textarea-testid-any-name-mock');

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
        disabled: false,
        hasError: true,
        isValid: false,
        type: 'input',
      },
      undefined,
    );
    expect(LabelElement).toHaveBeenCalledOnce();
    expect(LabelElement).toHaveBeenCalledWith(
      {
        hint: 'any-hint-mock',
        label: 'any-label-mock',
        name: 'any-name-mock',
        required: true,
      },
      undefined,
    );
    expect(inputElt).toBeInTheDocument();
    expect(inputElt).toHaveAttribute('aria-describedby', 'any-name-mock-messages');
    expect(inputElt).toHaveClass('any-input-classname-mock');
    expect(inputElt).not.toHaveAttribute('disabled');
    expect(inputElt).not.toHaveAttribute('maxLength');
    expect(inputElt).toHaveAttribute('name', 'any-name-mock');
    expect(MessagesElement).toHaveBeenCalledOnce();
    expect(MessagesElement).toHaveBeenCalledWith(
      {
        dataTestId: 'any-name-mock-messages',
        id: 'any-name-mock',
        messages: [errorMessageMock],
      },
      undefined,
    );
    expect(TextAreaMaxlengthComponent).not.toHaveBeenCalledOnce();
  });

  it('should match the snapshot, with config messages', () => {
    // Given
    jest.mocked(useFieldMeta).mockReturnValueOnce({
      errorsList: [],
      hasError: true,
      inputClassname: 'any-input-classname-mock',
      isValid: false,
    });
    const configMessageMock = Symbol('configMessageMock') as unknown as FieldMessage;
    jest.mocked(useFieldMessages).mockReturnValueOnce([configMessageMock]);

    // When
    const { container, getByTestId } = render(
      <TextAreaInput
        config={{
          hint: 'any-hint-mock',
          label: 'any-label-mock',
          maxChars: undefined,
          messages: [configMessageMock],
          required: true,
        }}
        input={{
          ...inputMock,
          className: 'any-classname-mock',
          disabled: false,
          name: 'any-name-mock',
          value: 'any-value-mock',
        }}
        meta={metaMock}
      />,
    );
    const inputElt = getByTestId('form-input-textarea-testid-any-name-mock');

    // Then
    expect(container).toMatchSnapshot();
    expect(useFieldMeta).toHaveBeenCalledOnce();
    expect(useFieldMeta).toHaveBeenCalledWith(metaMock);
    expect(useFieldMessages).toHaveBeenCalledOnce();
    expect(useFieldMessages).toHaveBeenCalledWith({
      errorsList: [],
      isValid: false,
      messages: [configMessageMock],
    });
    expect(GroupElement).toHaveBeenCalledOnce();
    expect(GroupElement).toHaveBeenCalledWith(
      {
        children: expect.any(Object),
        className: 'any-classname-mock',
        disabled: false,
        hasError: true,
        isValid: false,
        type: 'input',
      },
      undefined,
    );
    expect(LabelElement).toHaveBeenCalledOnce();
    expect(LabelElement).toHaveBeenCalledWith(
      {
        hint: 'any-hint-mock',
        label: 'any-label-mock',
        name: 'any-name-mock',
        required: true,
      },
      undefined,
    );
    expect(inputElt).toBeInTheDocument();
    expect(inputElt).toHaveAttribute('aria-describedby', 'any-name-mock-messages');
    expect(inputElt).toHaveClass('any-input-classname-mock');
    expect(inputElt).not.toHaveAttribute('disabled');
    expect(inputElt).not.toHaveAttribute('maxLength');
    expect(inputElt).toHaveAttribute('name', 'any-name-mock');
    expect(MessagesElement).toHaveBeenCalledOnce();
    expect(MessagesElement).toHaveBeenCalledWith(
      {
        dataTestId: 'any-name-mock-messages',
        id: 'any-name-mock',
        messages: [configMessageMock],
      },
      undefined,
    );
    expect(TextAreaMaxlengthComponent).not.toHaveBeenCalledOnce();
  });
});

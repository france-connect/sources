import { render } from '@testing-library/react';
import type { FieldMetaState } from 'react-final-form';

import { useFieldMeta } from '../../../hooks';
import { GroupElement, LabelElement, MessageElement } from '../../elements';
import { TextAreaInput } from './textarea.input';
import { TextAreaMaxlengthComponent } from './textarea.maxlength';

jest.mock('./textarea.maxlength');
jest.mock('../../elements/group/group.element');
jest.mock('../../elements/label/label.element');
jest.mock('../../elements/message/message.element');
jest.mock('../../../hooks/field-meta/field-meta.hook');

describe('TextAreaInput', () => {
  // Given
  const metaMock = Symbol('meta mock') as unknown as FieldMetaState<string>;

  const inputMock = {
    onBlur: jest.fn(),
    onChange: jest.fn(),
    onFocus: jest.fn(),
  };

  beforeEach(() => {
    // Given
    jest.mocked(useFieldMeta).mockReturnValue({
      errorMessage: undefined,
      hasError: false,
      inputClassname: 'any-input-classname-mock',
      isValid: true,
    });
  });

  it('should match the snapshot when value is valid', () => {
    // When
    const { container, getByTestId } = render(
      <TextAreaInput
        config={{
          hint: 'any-hint-mock',
          label: 'any-label-mock',
          maxChars: undefined,
        }}
        input={{
          ...inputMock,
          className: 'any-classname-mock',
          disabled: false,
          name: 'any-name-mock',
          required: true,
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
      {},
    );
    expect(LabelElement).toHaveBeenCalledOnce();
    expect(LabelElement).toHaveBeenCalledWith(
      {
        hint: 'any-hint-mock',
        label: 'any-label-mock',
        name: 'any-name-mock',
        required: true,
      },
      {},
    );
    expect(inputElt).toBeInTheDocument();
    expect(inputElt).toHaveAttribute('aria-describedby', 'any-name-mock-messages');
    expect(inputElt).toHaveClass('any-input-classname-mock');
    expect(inputElt).not.toHaveAttribute('disabled');
    expect(inputElt).not.toHaveAttribute('maxLength');
    expect(inputElt).toHaveAttribute('name', 'any-name-mock');
    expect(MessageElement).toHaveBeenCalledOnce();
    expect(MessageElement).toHaveBeenCalledWith(
      {
        dataTestId: 'any-name-mock-messages',
        error: undefined,
        id: 'any-name-mock',
        isValid: true,
      },
      {},
    );
    expect(TextAreaMaxlengthComponent).not.toHaveBeenCalledOnce();
  });

  it('should match the snapshot when a max length is defined', () => {
    // When
    const { container } = render(
      <TextAreaInput
        config={{
          hint: 'any-hint-mock',
          label: 'any-label-mock',
          maxChars: 255,
        }}
        input={{
          ...inputMock,
          className: 'any-classname-mock',
          disabled: false,
          name: 'any-name-mock',
          required: true,
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
      {},
    );
  });

  it('should match the snapshot when input value is invalid', () => {
    // Given
    jest.mocked(useFieldMeta).mockReturnValue({
      errorMessage: 'any-error-message-mock',
      hasError: true,
      inputClassname: 'any-input-classname-mock',
      isValid: false,
    });

    // When
    const { container, getByTestId } = render(
      <TextAreaInput
        config={{
          hint: 'any-hint-mock',
          label: 'any-label-mock',
          maxChars: undefined,
        }}
        input={{
          ...inputMock,
          className: 'any-classname-mock',
          disabled: false,
          name: 'any-name-mock',
          required: true,
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
      {},
    );
    expect(LabelElement).toHaveBeenCalledOnce();
    expect(LabelElement).toHaveBeenCalledWith(
      {
        hint: 'any-hint-mock',
        label: 'any-label-mock',
        name: 'any-name-mock',
        required: true,
      },
      {},
    );
    expect(inputElt).toBeInTheDocument();
    expect(inputElt).toHaveAttribute('aria-describedby', 'any-name-mock-messages');
    expect(inputElt).toHaveClass('any-input-classname-mock');
    expect(inputElt).not.toHaveAttribute('disabled');
    expect(inputElt).not.toHaveAttribute('maxLength');
    expect(inputElt).toHaveAttribute('name', 'any-name-mock');
    expect(MessageElement).toHaveBeenCalledOnce();
    expect(MessageElement).toHaveBeenCalledWith(
      {
        dataTestId: 'any-name-mock-messages',
        error: 'any-error-message-mock',
        id: 'any-name-mock',
        isValid: false,
      },
      {},
    );
    expect(TextAreaMaxlengthComponent).not.toHaveBeenCalledOnce();
  });
});

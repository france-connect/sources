import { render } from '@testing-library/react';

import { t } from '@fc/i18n';

import { useFieldMessages, useFieldMeta } from '../../../hooks';
import type { FieldMessage } from '../../../interfaces';
import { GroupElement, LabelElement, MessagesElement } from '../../elements';
import { SelectInput } from './select.input';

jest.mock('../../elements/group/group.element');
jest.mock('../../elements/label/label.element');
jest.mock('../../elements/messages/messages.element');
jest.mock('../../../hooks/field-meta/field-meta.hook');
jest.mock('./../../../hooks/field-messages/field-messages.hook');

describe('SelectInput', () => {
  // Given
  const inputMock = {
    onBlur: jest.fn(),
    onChange: jest.fn(),
    onFocus: jest.fn(),
    value: 'any-value-mock',
  };
  const choices = [
    { label: 'mock-label-1', value: 'mock-value-1' },
    { label: 'mock-label-2', value: 'mock-value-2' },
  ];

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
    const { container } = render(
      <SelectInput
        choices={choices}
        config={{ hint: 'any-hint-mock', label: 'any-label-mock', required: true }}
        input={{
          ...inputMock,
          className: 'any-className-mock',
          disabled: false,
          name: 'any-name-mock',
        }}
        meta={{ error: undefined, touched: false }}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(useFieldMeta).toHaveBeenCalledOnce();
    expect(useFieldMeta).toHaveBeenCalledWith({ error: undefined, touched: false });
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
        className: 'any-className-mock',
        disabled: false,
        hasError: false,
        isValid: true,
        type: 'select',
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
    expect(MessagesElement).not.toHaveBeenCalled();
    expect(t).toHaveBeenCalledOnce();
    expect(t).toHaveBeenCalledWith('Form.select.placeholder');
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
    const { container } = render(
      <SelectInput
        choices={choices}
        config={{ hint: 'any-hint-mock', label: 'any-label-mock', required: true }}
        input={{
          ...inputMock,
          className: 'any-className-mock',
          disabled: false,
          name: 'any-name-mock',
        }}
        meta={{ error: 'any-error-message-mock', touched: false }}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(useFieldMeta).toHaveBeenCalledOnce();
    expect(useFieldMeta).toHaveBeenCalledWith({ error: 'any-error-message-mock', touched: false });
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
        className: 'any-className-mock',
        disabled: false,
        hasError: true,
        isValid: false,
        type: 'select',
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
    expect(MessagesElement).toHaveBeenCalledOnce();
    expect(MessagesElement).toHaveBeenCalledWith(
      { dataTestId: 'any-name-mock-messages', id: 'any-name-mock', messages: [errorMessageMock] },
      undefined,
    );
    expect(t).toHaveBeenCalledOnce();
    expect(t).toHaveBeenCalledWith('Form.select.placeholder');
  });

  it('should match the snapshot, with config messages', () => {
    // Given
    jest.mocked(useFieldMeta).mockReturnValueOnce({
      errorsList: [],
      hasError: false,
      inputClassname: 'any-input-classname-mock',
      isValid: true,
    });
    const configMessageMock = Symbol('configMessageMock') as unknown as FieldMessage;
    jest.mocked(useFieldMessages).mockReturnValueOnce([configMessageMock]);

    // When
    const { container } = render(
      <SelectInput
        choices={choices}
        config={{
          hint: 'any-hint-mock',
          label: 'any-label-mock',
          messages: [configMessageMock],
          required: true,
        }}
        input={{
          ...inputMock,
          className: 'any-className-mock',
          disabled: false,
          name: 'any-name-mock',
        }}
        meta={{ error: 'any-error-message-mock', touched: false }}
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
      { dataTestId: 'any-name-mock-messages', id: 'any-name-mock', messages: [configMessageMock] },
      undefined,
    );
  });

  it('should render 2 select.option', () => {
    // Given
    jest.mocked(useFieldMeta).mockReturnValueOnce({
      errorsList: [],
      hasError: false,
      inputClassname: 'any-input-classname-mock',
      isValid: true,
    });

    // When
    const { getByText } = render(
      <SelectInput
        choices={choices}
        config={{ hint: 'any-hint-mock', label: 'any-label-mock', required: true }}
        input={{
          ...inputMock,
          className: 'any-className-mock',
          disabled: false,
          name: 'any-name-mock',
        }}
        meta={{ error: 'any-error-message-mock', touched: false }}
      />,
    );
    const optionElt1 = getByText('mock-label-1');
    const optionElt2 = getByText('mock-label-2');

    // Then
    expect(optionElt1).toBeInTheDocument();
    expect(optionElt1).toHaveAttribute('value', 'mock-value-1');
    expect(optionElt2).toBeInTheDocument();
    expect(optionElt2).toHaveAttribute('value', 'mock-value-2');
  });
});

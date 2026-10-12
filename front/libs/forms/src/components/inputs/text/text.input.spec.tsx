import { render } from '@testing-library/react';

import { useFieldMessages, useFieldMeta } from '../../../hooks';
import type { FieldMessage } from '../../../interfaces';
import type { PropsWithInputConfigType } from '../../../types';
import { GroupElement, LabelElement, MessagesElement } from '../../elements';
import { InputComponent } from '../input';
import { TextInput } from './text.input';
import { InputWithClipboard } from './with-clipboard';

jest.mock('./with-clipboard/with-clipboard.input');
jest.mock('../input/input.component');
jest.mock('../../elements/group/group.element');
jest.mock('../../elements/label/label.element');
jest.mock('../../elements/messages/messages.element');
jest.mock('../../../hooks/field-meta/field-meta.hook');
jest.mock('../../../hooks/field-messages/field-messages.hook');

describe('TextInput', () => {
  // Given
  const touchedMock = Symbol('touchedMock') as unknown as boolean;
  const readonlyMock = Symbol('readonlyMock') as unknown as boolean;

  it('should match snapshot, with error messages', () => {
    // Given
    const propsMock = {
      config: {
        hint: 'any-hint-mock',
        label: 'any-label-mock',
        readonly: readonlyMock,
      },
      input: {
        className: 'any-classname-mock',
        name: 'any-name-mock',
        type: 'text',
        value: 'any-input-value-mock',
      },
      meta: {
        error: 'any-error-message-mock',
        touched: touchedMock,
        value: 'any-input-value-mock',
      },
    } as unknown as PropsWithInputConfigType;

    jest.mocked(useFieldMeta).mockReturnValueOnce({
      errorsList: ['any-error-message-mock'],
      hasError: true,
      inputClassname: 'any-inputClassname-mock',
      isValid: false,
    });
    const errorMessageMock = Symbol('errorMessageMock') as unknown as FieldMessage;
    jest.mocked(useFieldMessages).mockReturnValueOnce([errorMessageMock]);

    // When
    // eslint-disable-next-line react/jsx-props-no-spreading
    const { container } = render(<TextInput {...propsMock} />);

    // Then
    expect(container).toMatchSnapshot();
    expect(useFieldMeta).toHaveBeenCalledExactlyOnceWith({
      error: 'any-error-message-mock',
      touched: touchedMock,
      value: 'any-input-value-mock',
    });
    expect(useFieldMessages).toHaveBeenCalledExactlyOnceWith({
      errorsList: ['any-error-message-mock'],
      isValid: false,
      messages: undefined,
    });
    expect(GroupElement).toHaveBeenCalledExactlyOnceWith(
      {
        children: expect.any(Array),
        className: 'any-classname-mock',
        hasError: true,
        isValid: false,
        type: 'input',
      },
      undefined,
    );
    expect(LabelElement).toHaveBeenCalledExactlyOnceWith(
      {
        hint: 'any-hint-mock',
        htmlFor: 'form-input-text-any-name-mock',
        label: 'any-label-mock',
      },
      undefined,
    );
    expect(MessagesElement).toHaveBeenCalledExactlyOnceWith(
      { id: 'any-name-mock', messages: [errorMessageMock] },
      undefined,
    );
  });

  it('should match snapshot, with config messages', () => {
    // Given
    const configMessageMock = Symbol('configMessageMock') as unknown as FieldMessage;

    const propsMock = {
      config: {
        hint: 'any-hint-mock',
        label: 'any-label-mock',
        messages: [configMessageMock],
        readonly: readonlyMock,
      },
      input: {
        className: 'any-classname-mock',
        name: 'any-name-mock',
        type: 'number',
        value: 'any-input-value-mock',
      },
      meta: {
        error: undefined,
        touched: touchedMock,
        value: 'any-input-value-mock',
      },
    } as unknown as PropsWithInputConfigType;

    jest.mocked(useFieldMeta).mockReturnValueOnce({
      errorsList: [],
      hasError: false,
      inputClassname: 'any-inputClassname-mock',
      isValid: true,
    });
    jest.mocked(useFieldMessages).mockReturnValueOnce([configMessageMock]);

    // When
    // eslint-disable-next-line react/jsx-props-no-spreading
    const { container } = render(<TextInput {...propsMock} />);

    // Then
    expect(container).toMatchSnapshot();
    expect(useFieldMeta).toHaveBeenCalledExactlyOnceWith({
      error: undefined,
      touched: touchedMock,
      value: 'any-input-value-mock',
    });
    expect(useFieldMessages).toHaveBeenCalledExactlyOnceWith({
      errorsList: [],
      isValid: true,
      messages: [configMessageMock],
    });
    expect(GroupElement).toHaveBeenCalledExactlyOnceWith(
      {
        children: expect.any(Array),
        className: 'any-classname-mock',
        hasError: false,
        isValid: true,
        type: 'input',
      },
      undefined,
    );
    expect(LabelElement).toHaveBeenCalledExactlyOnceWith(
      {
        hint: 'any-hint-mock',
        htmlFor: 'form-input-number-any-name-mock',
        label: 'any-label-mock',
      },
      undefined,
    );
    expect(MessagesElement).toHaveBeenCalledExactlyOnceWith(
      { id: 'any-name-mock', messages: [configMessageMock] },
      undefined,
    );
  });

  it('should match snapshot, without messages and when readonly is true', () => {
    // Given
    const propsMock = {
      config: {
        hint: 'any-hint-mock',
        label: 'any-label-mock',
        readonly: true,
      },
      input: {
        className: 'any-classname-mock',
        name: 'any-name-mock',
        type: 'text',
        value: 'any-input-value-mock',
      },
      meta: {
        error: 'any-error-message-mock',
        touched: touchedMock,
        value: 'any-input-value-mock',
      },
    } as unknown as PropsWithInputConfigType;

    jest.mocked(useFieldMeta).mockReturnValueOnce({
      errorsList: [],
      hasError: false,
      inputClassname: 'any-inputClassname-mock',
      isValid: true,
    });
    jest.mocked(useFieldMessages).mockReturnValueOnce([]);

    // When
    // eslint-disable-next-line react/jsx-props-no-spreading
    const { container } = render(<TextInput {...propsMock} />);

    // Then
    expect(container).toMatchSnapshot();
    expect(InputWithClipboard).toHaveBeenCalledExactlyOnceWith(
      {
        className: 'fr-mt-1w',
        id: 'form-input-text-any-name-mock',
        input: propsMock.input,
        inputClassname: 'any-inputClassname-mock',
      },
      undefined,
    );
    expect(MessagesElement).toHaveBeenCalledExactlyOnceWith(
      { id: 'any-name-mock', messages: [] },
      undefined,
    );
  });

  it('should match snapshot, without messages and when readonly is false', () => {
    // Given
    const propsMock = {
      config: {
        hint: 'any-hint-mock',
        label: 'any-label-mock',
        readonly: false,
      },
      input: {
        className: 'any-classname-mock',
        name: 'any-name-mock',
        type: 'text',
        value: 'any-input-value-mock',
      },
      meta: {
        error: 'any-error-message-mock',
        touched: touchedMock,
        value: 'any-input-value-mock',
      },
    } as unknown as PropsWithInputConfigType;

    jest.mocked(useFieldMeta).mockReturnValueOnce({
      errorsList: [],
      hasError: false,
      inputClassname: 'any-inputClassname-mock',
      isValid: true,
    });
    jest.mocked(useFieldMessages).mockReturnValueOnce([]);

    // When
    // eslint-disable-next-line react/jsx-props-no-spreading
    const { container } = render(<TextInput {...propsMock} />);

    // Then
    expect(container).toMatchSnapshot();
    expect(InputComponent).toHaveBeenCalledExactlyOnceWith(
      {
        className: 'any-inputClassname-mock',
        id: 'form-input-text-any-name-mock',
        input: propsMock.input,
      },
      undefined,
    );
    expect(MessagesElement).toHaveBeenCalledExactlyOnceWith(
      { id: 'any-name-mock', messages: [] },
      undefined,
    );
  });

  it('should build control id for type undefined', () => {
    // Given
    // Given
    const propsMock = {
      config: {
        hint: 'any-hint-mock',
        label: 'any-label-mock',
        readonly: false,
      },
      input: {
        className: 'any-classname-mock',
        name: 'any-name-mock',
        type: undefined,
        value: 'any-input-value-mock',
      },
      meta: {
        error: 'any-error-message-mock',
        touched: touchedMock,
        value: 'any-input-value-mock',
      },
    } as unknown as PropsWithInputConfigType;

    jest.mocked(useFieldMeta).mockReturnValueOnce({
      errorsList: [],
      hasError: false,
      inputClassname: 'any-inputClassname-mock',
      isValid: true,
    });
    jest.mocked(useFieldMessages).mockReturnValueOnce([]);

    // When
    // eslint-disable-next-line react/jsx-props-no-spreading
    render(<TextInput {...propsMock} />);

    // Then
    expect(InputComponent).toHaveBeenCalledExactlyOnceWith(
      {
        className: 'any-inputClassname-mock',
        id: 'form-input-text-any-name-mock',
        input: propsMock.input,
      },
      undefined,
    );
  });
});

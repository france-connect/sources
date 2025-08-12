import { render } from '@testing-library/react';
import type { FieldState } from 'final-form';
import { Field, useField } from 'react-final-form';

import { FieldTypes } from '../../../enums';
import { useFieldMessages, useFieldMeta } from '../../../hooks';
import type { FieldMessage } from '../../../interfaces';
import { MessagesElement } from '../../elements';
import { ChoiceInput } from '../../inputs';
import { ConsentField } from './consent.field';

jest.mock('../../elements/messages/messages.element');
jest.mock('../../elements/fieldset/fieldset.element');
jest.mock('./../../../hooks/field-meta/field-meta.hook');
jest.mock('./../../../hooks/field-messages/field-messages.hook');

describe('ConsentField', () => {
  // Given
  const validateMock = jest.fn();
  const metaMock = Symbol('metaMock') as unknown as FieldState<unknown>;
  const fieldMetaMock = {
    errorsList: [],
    hasError: false,
    inputClassname: 'any-inputClassname-mock',
    isValid: true,
  };
  const configMock = {
    label: 'any-label-mock',
    messages: undefined,
    name: 'any-name-mock',
    validate: validateMock,
  };

  beforeEach(() => {
    // Given
    jest.mocked(useField).mockReturnValue({
      input: expect.any(Object),
      meta: metaMock,
    });
    jest.mocked(useFieldMeta).mockReturnValue(fieldMetaMock);
    jest.mocked(useFieldMessages).mockReturnValue([]);
  });

  it('should match snapshot, without messages', () => {
    // When
    const { container } = render(<ConsentField config={configMock} />);

    // Then
    expect(container).toMatchSnapshot();
    expect(MessagesElement).not.toHaveBeenCalled();
  });

  it('should match snapshot, with messages', () => {
    // Given
    const errorMessagesMock = Symbol('errorMessagesMock') as unknown as FieldMessage;
    jest.mocked(useFieldMessages).mockReturnValue([errorMessagesMock]);

    // When
    const { container } = render(<ConsentField config={configMock} />);

    // Then
    expect(container).toMatchSnapshot();
    expect(MessagesElement).toHaveBeenCalledOnce();
    expect(MessagesElement).toHaveBeenCalledWith(
      {
        dataTestId: 'any-name-mock-messages',
        id: 'any-name-mock',
        messages: [errorMessagesMock],
      },
      undefined,
    );
  });

  it('should call useField', () => {
    // When
    render(<ConsentField config={configMock} />);

    // Then
    expect(useField).toHaveBeenCalledOnce();
    expect(useField).toHaveBeenCalledWith('any-name-mock');
  });

  it('should call useFieldMeta', () => {
    // When
    render(<ConsentField config={configMock} />);

    // Then
    expect(useFieldMeta).toHaveBeenCalledOnce();
    expect(useFieldMeta).toHaveBeenCalledWith(metaMock);
  });

  it('should call useFieldMessages', () => {
    // When
    render(<ConsentField config={configMock} />);

    // Then
    expect(useFieldMessages).toHaveBeenCalledOnce();
    expect(useFieldMessages).toHaveBeenCalledWith({
      errorsList: [],
      isValid: true,
      messages: undefined,
    });
  });

  it('should render Field', () => {
    // When
    render(<ConsentField config={configMock} />);

    // Then
    expect(Field).toHaveBeenCalledOnce();
    expect(Field).toHaveBeenCalledWith(
      {
        choice: {
          label: 'any-label-mock',
          value: 'consented',
        },
        component: ChoiceInput,
        config: {
          label: 'any-label-mock',
          messages: undefined,
          name: 'any-name-mock',
          validate: validateMock,
        },
        name: 'any-name-mock',
        type: FieldTypes.CHECKBOX,
      },
      undefined,
    );
  });

  it('should render the choice label with an asterisk when required', () => {
    // When
    render(
      <ConsentField
        config={{
          ...configMock,
          required: true,
        }}
      />,
    );

    // Then
    expect(Field).toHaveBeenCalledOnce();
    expect(Field).toHaveBeenCalledWith(
      expect.objectContaining({
        choice: {
          label: 'any-label-mock *',
          value: 'consented',
        },
      }),
      undefined,
    );
  });
});

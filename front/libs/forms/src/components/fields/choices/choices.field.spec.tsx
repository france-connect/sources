import { render } from '@testing-library/react';
import { Field, useField } from 'react-final-form';

import { FieldTypes } from '../../../enums';
import { useFieldMessages, useFieldMeta } from '../../../hooks';
import type { FieldMessage } from '../../../interfaces';
import { FieldsetElement, FieldsetLegendElement, MessagesElement } from '../../elements';
import { ChoiceInput } from '../../inputs';
import { ChoicesField } from './choices.field';

jest.mock('../../elements/messages/messages.element');
jest.mock('../../elements/fieldset/fieldset.element');
jest.mock('../../elements/fieldset-legend/fieldset-legend.element');
jest.mock('./../../../hooks/field-meta/field-meta.hook');
jest.mock('./../../../hooks/field-messages/field-messages.hook');

describe('ChoicesField', () => {
  beforeEach(() => {
    // Given
    jest.mocked(Field).mockImplementation(jest.fn());
    jest.mocked(useField).mockReturnValue({ input: expect.any(Object), meta: expect.any(Object) });
  });

  it('should match snapshot, without messages', () => {
    // Given
    const validateMock = jest.fn();
    jest.mocked(useFieldMeta).mockReturnValueOnce({
      errorsList: [],
      hasError: false,
      inputClassname: 'any-inputClassname-mock',
      isValid: true,
    });
    jest.mocked(useFieldMessages).mockReturnValueOnce([]);

    // When
    const { container } = render(
      <ChoicesField
        choices={[
          { label: 'any-choice-label-1', value: 'any-choice-value-1' },
          { label: 'any-choice-label-2', value: 'any-choice-value-2' },
        ]}
        config={{
          hint: 'any-hint-mock',
          label: 'any-label-mock',
          name: 'any-name-mock',
          required: true,
          type: FieldTypes.CHECKBOX,
          validate: validateMock,
        }}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(useField).toHaveBeenCalledOnce();
    expect(useField).toHaveBeenCalledWith('any-name-mock');
    expect(useFieldMeta).toHaveBeenCalledOnce();
    expect(useFieldMeta).toHaveBeenCalledWith(expect.any(Object));
    expect(useFieldMessages).toHaveBeenCalledOnce();
    expect(useFieldMessages).toHaveBeenCalledWith({
      errorsList: [],
      isValid: true,
      messages: undefined,
    });
    expect(FieldsetElement).toHaveBeenCalledOnce();
    expect(FieldsetElement).toHaveBeenCalledWith(
      {
        children: expect.any(Object),
        hasError: false,
        isValid: true,
        name: 'any-name-mock',
      },
      undefined,
    );
    expect(FieldsetLegendElement).toHaveBeenCalledOnce();
    expect(FieldsetLegendElement).toHaveBeenCalledWith(
      {
        hint: 'any-hint-mock',
        label: 'any-label-mock',
        name: 'any-name-mock',
        required: true,
      },
      undefined,
    );
    expect(MessagesElement).not.toHaveBeenCalled();
    expect(Field).toHaveBeenCalledTimes(2);
    expect(Field).toHaveBeenNthCalledWith(
      1,
      {
        choice: { label: 'any-choice-label-1', value: 'any-choice-value-1' },
        component: ChoiceInput,
        config: {
          hint: 'any-hint-mock',
          label: 'any-label-mock',
          name: 'any-name-mock',
          required: true,
          type: FieldTypes.CHECKBOX,
          validate: validateMock,
        },
        name: 'any-name-mock',
        type: FieldTypes.CHECKBOX,
        validate: validateMock,
        value: 'any-choice-value-1',
      },
      undefined,
    );
    expect(Field).toHaveBeenNthCalledWith(
      2,
      {
        choice: { label: 'any-choice-label-2', value: 'any-choice-value-2' },
        component: ChoiceInput,
        config: {
          hint: 'any-hint-mock',
          label: 'any-label-mock',
          name: 'any-name-mock',
          required: true,
          type: FieldTypes.CHECKBOX,
          validate: validateMock,
        },
        name: 'any-name-mock',
        type: FieldTypes.CHECKBOX,
        validate: validateMock,
        value: 'any-choice-value-2',
      },
      undefined,
    );
  });

  it('should match snapshot, with error messages', () => {
    // Given
    const validateMock = jest.fn();
    jest.mocked(useFieldMeta).mockReturnValueOnce({
      errorsList: ['any-errorMessage-mock'],
      hasError: true,
      inputClassname: 'any-inputClassname-mock',
      isValid: false,
    });
    const errorMessageMock = Symbol('errorMessageMock') as unknown as FieldMessage;
    jest.mocked(useFieldMessages).mockReturnValueOnce([errorMessageMock]);

    // When
    const { container } = render(
      <ChoicesField
        choices={[
          { label: 'any-choice-label-1', value: 'any-choice-value-1' },
          { label: 'any-choice-label-2', value: 'any-choice-value-2' },
        ]}
        config={{
          hint: 'any-hint-mock',
          label: 'any-label-mock',
          name: 'any-name-mock',
          required: true,
          type: FieldTypes.CHECKBOX,
          validate: validateMock,
        }}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(useField).toHaveBeenCalledOnce();
    expect(useField).toHaveBeenCalledWith('any-name-mock');
    expect(useFieldMeta).toHaveBeenCalledOnce();
    expect(useFieldMeta).toHaveBeenCalledWith(expect.any(Object));
    expect(useFieldMessages).toHaveBeenCalledOnce();
    expect(useFieldMessages).toHaveBeenCalledWith({
      errorsList: ['any-errorMessage-mock'],
      isValid: false,
      messages: undefined,
    });
    expect(FieldsetElement).toHaveBeenCalledOnce();
    expect(FieldsetElement).toHaveBeenCalledWith(
      {
        children: expect.any(Object),
        hasError: true,
        isValid: false,
        name: 'any-name-mock',
      },
      undefined,
    );
    expect(FieldsetLegendElement).toHaveBeenCalledOnce();
    expect(FieldsetLegendElement).toHaveBeenCalledWith(
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
    expect(Field).toHaveBeenCalledTimes(2);
    expect(Field).toHaveBeenNthCalledWith(
      1,
      {
        choice: { label: 'any-choice-label-1', value: 'any-choice-value-1' },
        component: ChoiceInput,
        config: {
          hint: 'any-hint-mock',
          label: 'any-label-mock',
          name: 'any-name-mock',
          required: true,
          type: FieldTypes.CHECKBOX,
          validate: validateMock,
        },
        name: 'any-name-mock',
        type: FieldTypes.CHECKBOX,
        validate: validateMock,
        value: 'any-choice-value-1',
      },
      undefined,
    );
    expect(Field).toHaveBeenNthCalledWith(
      2,
      {
        choice: { label: 'any-choice-label-2', value: 'any-choice-value-2' },
        component: ChoiceInput,
        config: {
          hint: 'any-hint-mock',
          label: 'any-label-mock',
          name: 'any-name-mock',
          required: true,
          type: FieldTypes.CHECKBOX,
          validate: validateMock,
        },
        name: 'any-name-mock',
        type: FieldTypes.CHECKBOX,
        validate: validateMock,
        value: 'any-choice-value-2',
      },
      undefined,
    );
  });

  it('should match snapshot, with config messages', () => {
    // Given
    const validateMock = jest.fn();
    jest.mocked(useFieldMeta).mockReturnValueOnce({
      errorsList: [],
      hasError: false,
      inputClassname: 'any-inputClassname-mock',
      isValid: true,
    });
    const infoMessageMock = Symbol('infoMessageMock') as unknown as FieldMessage;
    jest.mocked(useFieldMessages).mockReturnValueOnce([infoMessageMock]);

    // When
    const { container } = render(
      <ChoicesField
        choices={[
          { label: 'any-choice-label-1', value: 'any-choice-value-1' },
          { label: 'any-choice-label-2', value: 'any-choice-value-2' },
        ]}
        config={{
          hint: 'any-hint-mock',
          label: 'any-label-mock',
          messages: [infoMessageMock],
          name: 'any-name-mock',
          required: true,
          type: FieldTypes.CHECKBOX,
          validate: validateMock,
        }}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(useFieldMessages).toHaveBeenCalledOnce();
    expect(useFieldMessages).toHaveBeenCalledWith({
      errorsList: [],
      isValid: true,
      messages: [infoMessageMock],
    });
    expect(MessagesElement).toHaveBeenCalledOnce();
    expect(MessagesElement).toHaveBeenCalledWith(
      { dataTestId: 'any-name-mock-messages', id: 'any-name-mock', messages: [infoMessageMock] },
      undefined,
    );
  });
});

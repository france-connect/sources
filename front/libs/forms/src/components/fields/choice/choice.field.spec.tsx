import { render } from '@testing-library/react';
import { Field, useField } from 'react-final-form';

import { FieldTypes } from '../../../enums';
import { useFieldMeta } from '../../../hooks';
import { FieldsetElement, FieldsetLegendElement, MessageElement } from '../../elements';
import { ChoiceInput } from '../../inputs';
import { ChoiceField } from './choice.field';

jest.mock('../../elements/message/message.element');
jest.mock('../../elements/fieldset/fieldset.element');
jest.mock('../../elements/fieldset-legend/fieldset-legend.element');
jest.mock('./../../../hooks/field-meta/field-meta.hook');

describe('ChoiceField', () => {
  beforeEach(() => {
    // Given
    jest.mocked(Field).mockImplementation(jest.fn());
    jest.mocked(useField).mockReturnValue({ input: expect.any(Object), meta: expect.any(Object) });
    jest.mocked(useFieldMeta).mockReturnValue({
      errorMessage: 'any-errorMessage-mock',
      hasError: false,
      inputClassname: 'any-inputClassname-mock',
      isValid: false,
    });
  });

  it('should match snapshot', () => {
    // Given
    const validateMock = jest.fn();

    // When
    const { container } = render(
      <ChoiceField
        choices={[
          { label: 'any-choice-label-1', value: 'any-choice-value-1' },
          { label: 'any-choice-label-2', value: 'any-choice-value-2' },
        ]}
        config={{
          hint: 'any-hint-mock',
          label: 'any-label-mock',
          name: 'any-name-mock',
          required: true,
        }}
        type={FieldTypes.CHECKBOX}
        validate={validateMock}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(useField).toHaveBeenCalledOnce();
    expect(useField).toHaveBeenCalledWith('any-name-mock', {
      subscription: { error: true, touched: true },
    });
    expect(useFieldMeta).toHaveBeenCalledOnce();
    expect(useFieldMeta).toHaveBeenCalledWith(expect.any(Object));
    expect(FieldsetElement).toHaveBeenCalledOnce();
    expect(FieldsetElement).toHaveBeenCalledWith(
      {
        children: expect.any(Object),
        hasError: false,
        isValid: false,
        name: 'any-name-mock',
      },
      {},
    );
    expect(FieldsetLegendElement).toHaveBeenCalledOnce();
    expect(FieldsetLegendElement).toHaveBeenCalledWith(
      {
        hint: 'any-hint-mock',
        label: 'any-label-mock',
        name: 'any-name-mock',
        required: true,
      },
      {},
    );
    expect(MessageElement).toHaveBeenCalledOnce();
    expect(MessageElement).toHaveBeenCalledWith(
      {
        error: 'any-errorMessage-mock',
        id: 'any-name-mock',
        isValid: false,
      },
      {},
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
        },
        name: 'any-name-mock',
        type: FieldTypes.CHECKBOX,
        validate: validateMock,
        value: 'any-choice-value-1',
      },
      {},
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
        },
        name: 'any-name-mock',
        type: FieldTypes.CHECKBOX,
        validate: validateMock,
        value: 'any-choice-value-2',
      },
      {},
    );
  });
});

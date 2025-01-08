import { render } from '@testing-library/react';

import { ChoiceField, FieldTypes, InputField, SelectField } from '@fc/forms';

import { useFieldValidate } from '../../hooks';
import { DTO2FieldComponent } from './dto2field.component';

jest.mock('../../hooks/field-validate/field-validate.hook');

describe('DTO2FieldComponent', () => {
  // Given
  const maxCharsMock = Symbol('maxChars') as unknown as number;
  const disabledMock = Symbol('disabled') as unknown as boolean;
  const requiredMock = Symbol('required') as unknown as boolean;
  const placeholderMock = Symbol('placeholder') as unknown as string;
  const labelMock = Symbol('label') as unknown as string;
  const nameMock = Symbol('name') as unknown as string;
  const valueMock = Symbol('value') as unknown as string;
  const typeMock = Symbol('type') as unknown as FieldTypes;
  const fieldMock = {
    disabled: disabledMock,
    label: labelMock,
    maxChars: maxCharsMock,
    name: nameMock,
    order: 1,
    placeholder: placeholderMock,
    required: requiredMock,
    size: 'md',
    type: typeMock,
    validators: expect.anything(),
    value: valueMock,
  };
  const validateMock = jest.fn();

  beforeEach(() => {
    // Given
    jest.mocked(useFieldValidate).mockReturnValue(validateMock);
  });

  it('should call useFieldValidate hook', () => {
    // When
    render(<DTO2FieldComponent field={fieldMock} />);

    // Then
    expect(useFieldValidate).toHaveBeenCalledOnce();
    expect(useFieldValidate).toHaveBeenCalledWith({
      disabled: disabledMock,
      required: requiredMock,
      validators: expect.anything(),
    });
  });

  it('should match the snapshot, should create input field (default)', () => {
    // When
    const { container } = render(<DTO2FieldComponent field={fieldMock} />);

    // Then
    expect(container).toMatchSnapshot();
    expect(useFieldValidate).toHaveBeenCalledOnce();
    expect(InputField).toHaveBeenCalledOnce();
    expect(InputField).toHaveBeenCalledWith(
      {
        config: {
          clipboardDisabled: false,
          hint: placeholderMock,
          inline: true,
          label: labelMock,
          maxChars: maxCharsMock,
          name: nameMock,
          required: requiredMock,
          size: 'md',
          value: valueMock,
        },
        type: typeMock,
        validate: validateMock,
      },
      {},
    );
  });

  it('should match the snapshot, should create select field', () => {
    // Given
    const optionsMock = [
      {
        label: 'option 1 label mock',
        value: 'option_1_value_mock',
      },
      {
        label: 'option 2 label mock',
        value: 'option_2_value_mock',
      },
    ];
    const selectFieldMock = { ...fieldMock, options: optionsMock, type: FieldTypes.SELECT };

    // When
    render(<DTO2FieldComponent field={selectFieldMock} />);

    // Then
    expect(SelectField).toHaveBeenCalledOnce();
    expect(SelectField).toHaveBeenCalledWith(
      {
        choices: optionsMock,
        config: {
          clipboardDisabled: false,
          hint: placeholderMock,
          inline: true,
          label: labelMock,
          maxChars: maxCharsMock,
          name: nameMock,
          required: requiredMock,
          size: 'md',
          value: valueMock,
        },
        validate: validateMock,
      },
      {},
    );
  });

  it('should match the snapshot, should create a choice field when type is "radio', () => {
    // Given
    const optionsMock = [
      {
        label: 'option 1 label mock',
        value: 'option_1_value_mock',
      },
      {
        label: 'option 2 label mock',
        value: 'option_2_value_mock',
      },
    ];
    const radioFieldMock = { ...fieldMock, options: optionsMock, type: FieldTypes.RADIO };

    // When
    render(<DTO2FieldComponent field={radioFieldMock} />);

    // Then
    expect(ChoiceField).toHaveBeenCalledOnce();
    expect(ChoiceField).toHaveBeenCalledWith(
      {
        choices: optionsMock,
        config: {
          clipboardDisabled: false,
          hint: placeholderMock,
          inline: true,
          label: labelMock,
          maxChars: maxCharsMock,
          name: nameMock,
          required: requiredMock,
          size: 'md',
          value: valueMock,
        },
        type: 'radio',
        validate: validateMock,
      },
      {},
    );
  });

  it('should match the snapshot, should create a choice field when type is "checkbox', () => {
    // Given
    const optionsMock = [
      {
        label: 'option 1 label mock',
        value: 'option_1_value_mock',
      },
      {
        label: 'option 2 label mock',
        value: 'option_2_value_mock',
      },
    ];
    const checkboxFieldMock = { ...fieldMock, options: optionsMock, type: FieldTypes.CHECKBOX };

    // When
    render(<DTO2FieldComponent field={checkboxFieldMock} />);

    // Then
    expect(ChoiceField).toHaveBeenCalledOnce();
    expect(ChoiceField).toHaveBeenCalledWith(
      {
        choices: optionsMock,
        config: {
          clipboardDisabled: false,
          hint: placeholderMock,
          inline: true,
          label: labelMock,
          maxChars: maxCharsMock,
          name: nameMock,
          required: requiredMock,
          size: 'md',
          value: valueMock,
        },
        type: 'checkbox',
        validate: validateMock,
      },
      {},
    );
  });
});

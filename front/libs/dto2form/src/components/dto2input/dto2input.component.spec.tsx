import { render } from '@testing-library/react';

import { ConfigService } from '@fc/config';
import { ArrayField, ChoicesField, FieldTypes, InputField, SelectField } from '@fc/forms';

import { useFieldValidate } from '../../hooks';
import { DTO2InputComponent } from './dto2input.component';

jest.mock('../../hooks/field-validate/field-validate.hook');

describe('DTO2InputComponent', () => {
  // Given
  const maxCharsMock = Symbol('maxChars') as unknown as number;
  const inlineMock = Symbol('inline') as unknown as boolean;
  const readonlyMock = Symbol('readonly') as unknown as boolean;
  const disabledMock = Symbol('disabled') as unknown as boolean;
  const requiredMock = Symbol('required') as unknown as boolean;
  const hintMock = Symbol('hint') as unknown as string;
  const labelMock = Symbol('label') as unknown as string;
  const nameMock = Symbol('name') as unknown as string;
  const valueMock = Symbol('value') as unknown as string;

  const fieldMock = {
    disabled: disabledMock,
    hint: hintMock,
    inline: inlineMock,
    label: labelMock,
    maxChars: maxCharsMock,
    name: nameMock,
    order: 1,
    readonly: readonlyMock,
    required: requiredMock,
    size: 'md',
    validators: expect.anything(),
    value: valueMock,
  };
  const validateMock = jest.fn();

  beforeEach(() => {
    // Given
    jest.mocked(useFieldValidate).mockReturnValue(validateMock);
    jest.mocked(ConfigService.get).mockReturnValue({ validateOnFieldChange: true });
  });

  it('should call useFieldValidate hook', () => {
    // When
    render(<DTO2InputComponent field={{ ...fieldMock, type: FieldTypes.TEXT }} />);

    // Then
    expect(useFieldValidate).toHaveBeenCalledOnce();
    expect(useFieldValidate).toHaveBeenCalledWith({
      disabled: disabledMock,
      required: requiredMock,
      validators: expect.anything(),
    });
  });

  it('should match the snapshot, should create an InputField', () => {
    // When
    const { container } = render(
      <DTO2InputComponent field={{ ...fieldMock, type: FieldTypes.TEXT }} />,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(useFieldValidate).toHaveBeenCalledOnce();
    expect(InputField).toHaveBeenCalledOnce();
    expect(InputField).toHaveBeenCalledWith(
      {
        choices: [],
        config: {
          hint: hintMock,
          inline: inlineMock,
          label: labelMock,
          maxChars: maxCharsMock,
          name: nameMock,
          readonly: readonlyMock,
          required: requiredMock,
          size: 'md',
          type: 'text',
          validate: validateMock,
          value: valueMock,
        },
      },
      {},
    );
  });

  it('should match the snapshot, should create a SelectField when type is "select"', () => {
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

    // When
    render(
      <DTO2InputComponent
        field={{ ...fieldMock, options: optionsMock, type: FieldTypes.SELECT }}
      />,
    );

    // Then
    expect(SelectField).toHaveBeenCalledOnce();
    expect(SelectField).toHaveBeenCalledWith(
      {
        choices: optionsMock,
        config: {
          hint: hintMock,
          inline: inlineMock,
          label: labelMock,
          maxChars: maxCharsMock,
          name: nameMock,
          readonly: readonlyMock,
          required: requiredMock,
          size: 'md',
          type: 'select',
          validate: validateMock,
          value: valueMock,
        },
      },
      {},
    );
  });

  it('should match the snapshot, should create a ChoicesField when type is "radio"', () => {
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
    render(<DTO2InputComponent field={radioFieldMock} />);

    // Then
    expect(ChoicesField).toHaveBeenCalledOnce();
    expect(ChoicesField).toHaveBeenCalledWith(
      {
        choices: optionsMock,
        config: {
          hint: hintMock,
          inline: inlineMock,
          label: labelMock,
          maxChars: maxCharsMock,
          name: nameMock,
          readonly: readonlyMock,
          required: requiredMock,
          size: 'md',
          type: 'radio',
          validate: validateMock,
          value: valueMock,
        },
      },
      {},
    );
  });

  it('should match the snapshot, should create a ChoicesField when type is "checkbox"', () => {
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
    render(<DTO2InputComponent field={checkboxFieldMock} />);

    // Then
    expect(ChoicesField).toHaveBeenCalledOnce();
    expect(ChoicesField).toHaveBeenCalledWith(
      {
        choices: optionsMock,
        config: {
          hint: hintMock,
          inline: inlineMock,
          label: labelMock,
          maxChars: maxCharsMock,
          name: nameMock,
          readonly: readonlyMock,
          required: requiredMock,
          size: 'md',
          type: 'checkbox',
          validate: validateMock,
          value: valueMock,
        },
      },
      {},
    );
  });

  it('should match the snapshot, should create an ArrayField when "array === true"', () => {
    // Given
    const arrayFieldMock = { ...fieldMock, array: true, type: FieldTypes.TEXT };

    // When
    render(<DTO2InputComponent field={arrayFieldMock} />);

    // Then
    expect(ArrayField).toHaveBeenCalledOnce();
    expect(ArrayField).toHaveBeenCalledWith(
      {
        choices: [],
        config: {
          hint: hintMock,
          inline: inlineMock,
          label: labelMock,
          maxChars: maxCharsMock,
          name: nameMock,
          readonly: readonlyMock,
          required: requiredMock,
          size: 'md',
          type: 'text',
          validate: validateMock,
          value: valueMock,
        },
      },
      {},
    );
  });

  it('should call InputField without the validate function when DTO2Form.validateOnFieldChange is false', () => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValueOnce({ validateOnFieldChange: false });

    // When
    render(<DTO2InputComponent field={{ ...fieldMock, type: FieldTypes.TEXT }} />);

    // Then
    expect(useFieldValidate).toHaveBeenCalledOnce();
    expect(ConfigService.get).toHaveBeenCalledOnce();
    expect(ConfigService.get).toHaveBeenCalledWith('DTO2Form');
    expect(InputField).toHaveBeenCalledOnce();
    expect(InputField).toHaveBeenCalledWith(
      {
        choices: [],
        config: {
          hint: hintMock,
          inline: inlineMock,
          label: labelMock,
          maxChars: maxCharsMock,
          name: nameMock,
          readonly: readonlyMock,
          required: requiredMock,
          size: 'md',
          type: 'text',
          validate: undefined,
          value: valueMock,
        },
      },
      {},
    );
  });
});

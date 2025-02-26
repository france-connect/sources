import { render } from '@testing-library/react';
import { Field } from 'react-final-form';

import { FieldTypes } from '../../../enums';
import { TextInput } from '../../inputs';
import { InputField } from './input.field';

describe('InputField', () => {
  beforeEach(() => {
    // Given
    jest.mocked(Field).mockImplementation(jest.fn());
  });

  it('should match snapshot and render a text input', () => {
    // Given
    const validateMock = jest.fn();

    // When
    const { container } = render(
      <InputField
        config={{
          label: 'any-label-mock',
          name: 'any-name-mock',
          required: true,
          type: FieldTypes.TEXT,
          validate: validateMock,
        }}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(Field).toHaveBeenCalledOnce();
    expect(Field).toHaveBeenCalledWith(
      {
        component: TextInput,
        config: {
          label: 'any-label-mock',
          required: true,
        },
        name: 'any-name-mock',
        type: FieldTypes.TEXT,
        validate: validateMock,
      },
      {},
    );
  });
});

import { render } from '@testing-library/react';
import { Field } from 'react-final-form';

import { FieldTypes } from '../../../enums';
import { TextAreaInput } from '../../inputs';
import { TextAreaField } from './textarea.field';

describe('TextAreaField', () => {
  beforeEach(() => {
    // Given
    jest.mocked(Field).mockImplementation(jest.fn());
  });

  it('should match snapshot and render a text area', () => {
    // Given
    const validateMock = jest.fn();

    // When
    const { container } = render(
      <TextAreaField
        config={{
          label: 'any-label-mock',
          name: 'any-name-mock',
          required: true,
          type: FieldTypes.TEXTAREA,
          validate: validateMock,
        }}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(Field).toHaveBeenCalledOnce();
    expect(Field).toHaveBeenCalledWith(
      {
        component: TextAreaInput,
        config: {
          label: 'any-label-mock',
          required: true,
        },
        name: 'any-name-mock',
        type: FieldTypes.TEXTAREA,
        validate: validateMock,
      },
      undefined,
    );
  });
});

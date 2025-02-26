import { render } from '@testing-library/react';
import { Field } from 'react-final-form';

import { FieldTypes } from '../../../enums';
import { SelectInput } from '../../inputs';
import { SelectField } from './select.field';

describe('selectField', () => {
  it('should match the snapshot', () => {
    // Given
    const valildateMock = jest.fn();
    jest.mocked(Field).mockImplementationOnce(() => <div data-mockid="Field" />);

    // When
    const { container } = render(
      <SelectField
        choices={[
          { label: 'mock-label-1', value: 'mock-value-1' },
          { label: 'mock-label-2', value: 'mock-value-2' },
        ]}
        config={{
          hint: 'any-hint-mock',
          label: 'any-label-mock',
          name: 'any-name-mock',
          required: true,
          type: FieldTypes.SELECT,
          validate: valildateMock,
        }}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(Field).toHaveBeenCalledOnce();
    expect(Field).toHaveBeenCalledWith(
      {
        choices: [
          { label: 'mock-label-1', value: 'mock-value-1' },
          { label: 'mock-label-2', value: 'mock-value-2' },
        ],
        component: SelectInput,
        config: {
          hint: 'any-hint-mock',
          label: 'any-label-mock',
          required: true,
        },
        name: 'any-name-mock',
        subscription: { error: true, touched: true, value: true },
        type: 'select',
        validate: valildateMock,
      },
      {},
    );
  });
});

import { render, screen } from '@testing-library/react';

import { useFieldMessages, useFieldMeta } from '../../../hooks';
import { SelectInput } from './select.input';

jest.mock('../../../hooks/field-meta/field-meta.hook');
jest.mock('../../../hooks/field-messages/field-messages.hook');

describe('SelectInput a11y (RGAA 11.1)', () => {
  const inputHandlersMock = {
    onBlur: jest.fn(),
    onChange: jest.fn(),
    onFocus: jest.fn(),
  };

  beforeEach(() => {
    // Given
    jest.mocked(useFieldMeta).mockReturnValue({
      errorsList: [],
      hasError: false,
      inputClassname: 'fr-input',
      isValid: false,
    });
    jest.mocked(useFieldMessages).mockReturnValue([]);
  });

  it('should associate the select label via htmlFor / id', () => {
    // When
    render(
      <SelectInput
        choices={[
          { label: 'Option A', value: 'a' },
          { label: 'Option B', value: 'b' },
        ]}
        config={{ label: 'Pays', required: true }}
        input={{
          ...inputHandlersMock,
          name: 'country',
          value: '',
        }}
        meta={{}}
      />,
    );

    const select = screen.getByLabelText(/Pays/);
    const label = screen.getByText(/Pays/).closest('label');

    // Then
    expect(label).toHaveAttribute('for', 'form-input-select-country');
    expect(select).toHaveAttribute('id', 'form-input-select-country');
    expect(select).toBe(screen.getByRole('combobox'));
  });
});

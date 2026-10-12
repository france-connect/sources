import { render, screen } from '@testing-library/react';

import { useFieldMessages, useFieldMeta } from '../../../hooks';
import { TextInput } from './text.input';

jest.mock('../../../hooks/field-meta/field-meta.hook');
jest.mock('../../../hooks/field-messages/field-messages.hook');

describe('TextInput a11y (RGAA 11.1)', () => {
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

  it('should associate the text input label via htmlFor / id', () => {
    // When
    render(
      <TextInput
        config={{ label: 'Adresse email', required: true }}
        input={{
          ...inputHandlersMock,
          name: 'email',
          type: 'text',
          value: '',
        }}
        meta={{}}
      />,
    );

    const input = screen.getByLabelText(/Adresse email/);
    const label = screen.getByText(/Adresse email/).closest('label');

    // Then
    expect(label).toHaveAttribute('for', 'form-input-text-email');
    expect(input).toHaveAttribute('id', 'form-input-text-email');
    expect(input).toBe(screen.getByRole('textbox'));
  });
});

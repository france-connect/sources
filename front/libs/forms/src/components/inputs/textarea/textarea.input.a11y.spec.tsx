import { render, screen } from '@testing-library/react';

import { useFieldMessages, useFieldMeta } from '../../../hooks';
import { TextAreaInput } from './textarea.input';

jest.mock('../../../hooks/field-meta/field-meta.hook');
jest.mock('../../../hooks/field-messages/field-messages.hook');
jest.mock('./textarea.maxlength');

describe('TextAreaInput a11y (RGAA 11.1)', () => {
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

  it('should associate the textarea label via htmlFor / id', () => {
    // When
    render(
      <TextAreaInput
        config={{ label: 'Commentaire', required: true }}
        input={{
          ...inputHandlersMock,
          name: 'comment',
          value: '',
        }}
        meta={{}}
      />,
    );

    const textarea = screen.getByLabelText(/Commentaire/);
    const label = screen.getByText(/Commentaire/).closest('label');

    // Then
    expect(label).toHaveAttribute('for', 'form-input-textarea-comment');
    expect(textarea).toHaveAttribute('id', 'form-input-textarea-comment');
    expect(textarea).toBe(screen.getByRole('textbox'));
  });
});

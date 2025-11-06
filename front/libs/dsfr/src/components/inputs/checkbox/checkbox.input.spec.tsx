import { useField } from 'react-final-form';

import { t } from '@fc/i18n';
import { renderWithFinalForm } from '@fc/testing-library';

import { CheckboxInput, validateCheckbox } from './checkbox.input';

jest.mock('./checkbox.component');

describe('CheckboxInput', () => {
  beforeEach(() => {
    jest.mocked(useField).mockReturnValue({
      input: expect.any(Object),
      meta: { error: false, touched: true },
    });
  });

  it('should match the snapshot', () => {
    // When
    const { container } = renderWithFinalForm(
      <CheckboxInput label="any-label-mock" name="any-name-mock" />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should have called useField', () => {
    renderWithFinalForm(<CheckboxInput label="any-label-mock" name="any-name-mock" />);

    // Then
    expect(useField).toHaveBeenCalledOnce();
    expect(useField).toHaveBeenCalledWith('any-name-mock', {
      subscription: { error: true, touched: true },
    });
  });
});

describe('validateCheckbox', () => {
  it('should return undefined', () => {
    // When / Then
    expect(validateCheckbox(true)).toBeUndefined();
  });

  it('should return default message', () => {
    // Given
    jest.mocked(t).mockReturnValueOnce('any-checkbox-label-mock');

    // When
    const result = validateCheckbox(false);

    // Then
    expect(t).toHaveBeenCalledExactlyOnceWith('DSFR.checkbox.label');
    expect(result).toBe('any-checkbox-label-mock');
  });
});

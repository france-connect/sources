import { isNotEmpty } from '@fc/common';

import { isRequired } from './is-required.validator';

describe('isRequired', () => {
  it('should return the error message if the field value is a string and is empty', () => {
    // Given
    jest.mocked(isNotEmpty).mockReturnValueOnce(false);
    const fieldValue = '';
    const message = 'This field is required';

    // When
    const result = isRequired(message)(fieldValue);

    // Then
    expect(result).toBe(message);
    expect(isNotEmpty).toHaveBeenCalledOnce();
    expect(isNotEmpty).toHaveBeenCalledWith('');
  });

  it('should return the error message if the field value is an array and has an empty value', () => {
    // Given
    jest.mocked(isNotEmpty).mockReturnValueOnce(true).mockReturnValueOnce(false);
    const fieldValue = ['not empty', ''];
    const message = 'This field is required';

    // When
    const result = isRequired(message)(fieldValue);

    // Then
    expect(result).toBe(message);
    expect(isNotEmpty).toHaveBeenCalledTimes(2);
    expect(isNotEmpty).toHaveBeenNthCalledWith(1, 'not empty');
    expect(isNotEmpty).toHaveBeenNthCalledWith(2, '');
  });

  it('should return undefined if the field value is a string and is not empty', () => {
    // Given
    jest.mocked(isNotEmpty).mockReturnValueOnce(true);
    const fieldValue = 'John Doe';
    const message = 'This field is required';

    // When
    const result = isRequired(message)(fieldValue);

    // Then
    expect(result).toBeUndefined();
    expect(isNotEmpty).toHaveBeenCalledOnce();
    expect(isNotEmpty).toHaveBeenCalledWith('John Doe');
  });

  it('should return undefined if the field value is an array and is not empty', () => {
    // Given
    jest.mocked(isNotEmpty).mockReturnValueOnce(true).mockReturnValueOnce(true);
    const fieldValue = ['John Doe', 'Jane Doe'];
    const message = 'This field is required';

    // When
    const result = isRequired(message)(fieldValue);

    // Then
    expect(result).toBeUndefined();
    expect(isNotEmpty).toHaveBeenCalledTimes(2);
    expect(isNotEmpty).toHaveBeenNthCalledWith(1, 'John Doe');
    expect(isNotEmpty).toHaveBeenNthCalledWith(2, 'Jane Doe');
  });
});

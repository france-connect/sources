import { isNotEmpty } from '../is-not-empty';
import { isFilled } from './is-filled.validator';

jest.mock('../is-not-empty/is-not-empty.validator');

describe('isFilled', () => {
  it('should return false when value is an empty string', () => {
    // Given
    const fieldValue = '';
    jest.mocked(isNotEmpty).mockReturnValueOnce(false);

    // When
    const result = isFilled(fieldValue);

    // Then
    expect(result).toBeFalse();
    expect(isNotEmpty).toHaveBeenCalledOnce();
    expect(isNotEmpty).toHaveBeenCalledWith('');
  });

  it('should return false when one of the array values is empty', () => {
    // Given
    const fieldValue = ['not empty', ''];
    jest.mocked(isNotEmpty).mockReturnValueOnce(true).mockReturnValueOnce(false);

    // When
    const result = isFilled(fieldValue);

    // Then
    expect(result).toBeFalse();
    expect(isNotEmpty).toHaveBeenCalledTimes(2);
    expect(isNotEmpty).toHaveBeenNthCalledWith(1, 'not empty');
    expect(isNotEmpty).toHaveBeenNthCalledWith(2, '');
  });

  it('should return true when the value is a string and is not empty', () => {
    // Given
    jest.mocked(isNotEmpty).mockReturnValueOnce(true);
    const fieldValue = 'John Doe';

    // When
    const result = isFilled(fieldValue);

    // Then
    expect(result).toBeTrue();
    expect(isNotEmpty).toHaveBeenCalledOnce();
    expect(isNotEmpty).toHaveBeenCalledWith('John Doe');
  });

  it('should return true when all array values are not empty', () => {
    // Given
    jest.mocked(isNotEmpty).mockReturnValueOnce(true).mockReturnValueOnce(true);
    const fieldValue = ['John Doe', 'Jane Doe'];

    // When
    const result = isFilled(fieldValue);

    // Then
    expect(result).toBeTrue();
    expect(isNotEmpty).toHaveBeenCalledTimes(2);
    expect(isNotEmpty).toHaveBeenNthCalledWith(1, 'John Doe');
    expect(isNotEmpty).toHaveBeenNthCalledWith(2, 'Jane Doe');
  });
});

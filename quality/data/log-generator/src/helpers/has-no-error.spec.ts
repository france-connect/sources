import { hasNoError } from './has-no-error';
import { warn } from './log';

jest.mock('./log', () => ({
  warn: jest.fn(),
}));

describe('hasNoError', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should return true when there are no errors and the item count matches nbOfOrders', () => {
    // Given
    const data = { errors: false, items: [{}, {}] };

    // When
    const result = hasNoError(data, 2);

    // Then
    expect(result).toBe(true);
    expect(warn).not.toHaveBeenCalled();
  });

  test('should return true when there are no errors and statuses are below 300', () => {
    // Given
    const data = {
      errors: false,
      items: [{ index: { status: 200 } }, { index: { status: 201 } }],
    };

    // When
    const result = hasNoError(data, 2);

    // Then
    expect(result).toBe(true);
    expect(warn).not.toHaveBeenCalled();
  });

  it('should return false and log warning when there are errors', () => {
    // Given
    const data = {
      errors: true,
      items: [
        { index: { status: 200 } },
        { index: { error: { reason: 'Reason1', type: 'Type1' }, status: 300 } },
      ],
    };

    // When
    const result = hasNoError(data, 2);

    // Then
    expect(result).toBe(false);
    expect(warn).toHaveBeenCalledWith('Failed when asked 2 and get 2 inserts');
    expect(warn).toHaveBeenCalledWith('Error in ES: <Type1: Reason1>');
  });

  it('should return false and log warning when the item count does not match nbOfOrders', () => {
    // Given
    const data = { errors: false, items: [{}, {}] };

    // When
    const result = hasNoError(data, 3);

    // Then
    expect(result).toBe(false);
    expect(warn).toHaveBeenCalledWith('Failed when asked 3 and get 2 inserts');
    expect(warn).not.toHaveBeenCalledWith('Error in ES:');
  });

  it('should handle nested errors correctly', () => {
    // Given
    const data = {
      errors: true,
      items: [
        { index: { status: 200 } },
        { index: { error: { reason: 'Reason1', type: 'Type1' }, status: 300 } },
        { index: { error: { reason: 'Reason2', type: 'Type2' }, status: 400 } },
      ],
    };

    // When
    const result = hasNoError(data, 3);

    // Then
    expect(result).toBe(false);
    expect(warn).toHaveBeenCalledWith('Failed when asked 3 and get 3 inserts');
    expect(warn).toHaveBeenCalledWith(
      'Error in ES: <Type1: Reason1>,<Type2: Reason2>',
    );
  });
});

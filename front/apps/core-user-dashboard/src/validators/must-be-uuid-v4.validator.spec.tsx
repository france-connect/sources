import { isUUID } from 'validator';

import { mustBeUUIDv4 } from './must-be-uuid-v4.validator';

describe('mustBeUUIDv4', () => {
  // Given
  const validate = mustBeUUIDv4();

  it('should return undefined if the value is empty', () => {
    // When / Then
    expect(validate(undefined)).toBeUndefined();
  });

  it('should call validator.isUUID', () => {
    // When
    validate('value');

    // Then
    expect(isUUID).toHaveBeenCalledOnce();
    expect(isUUID).toHaveBeenCalledWith('value', '4');
  });

  it('should return default message if the value is not a uuidv4', () => {
    // Given
    jest.mocked(isUUID).mockReturnValueOnce(false);

    // When / Then
    expect(validate('not an uuid')).toBe('Le code est erroné, veuillez vérifier sa valeur');
  });

  it('should return undefined if value is a uuidv4', () => {
    // Given
    jest.mocked(isUUID).mockReturnValueOnce(true);

    // When / Then
    expect(validate('04f9e219-eec6-489e-ac64-52e98d3e39e9')).toBeUndefined();
  });
});

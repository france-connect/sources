import { IsBufferEncodingConstraint } from './is-buffer-encoding.validator';

describe('IsBufferEncoding', () => {
  const bufferIsEncodingMock = jest.spyOn(Buffer, 'isEncoding');

  let validator: IsBufferEncodingConstraint;

  beforeEach(() => {
    validator = new IsBufferEncodingConstraint();
    jest.resetAllMocks();
  });
  describe('validate', () => {
    it('should call Buffer.isEncoding', () => {
      // Given
      const input = 'foo';
      // When
      validator.validate(input);
      // Then
      expect(bufferIsEncodingMock).toHaveBeenCalledTimes(1);
      expect(bufferIsEncodingMock).toHaveBeenCalledWith(input);
    });

    it('should return truthy result from Buffer.isEncoding', () => {
      // Given
      const input = 'foo';
      bufferIsEncodingMock.mockReturnValue(true);
      // When
      const result = validator.validate(input);
      // Then
      expect(result).toBeTruthy();
    });

    it('should return falsy result from Buffer.isEncoding', () => {
      // Given
      const input = 'foo';
      bufferIsEncodingMock.mockReturnValue(false);
      // When
      const result = validator.validate(input);
      // Then
      expect(result).toBeFalsy();
    });

    it('should return false if not a string', () => {
      // given
      const input = { foo: [] };
      // When
      const result = validator.validate(input);
      // Then
      expect(result).toBeFalsy();
    });
  });
});

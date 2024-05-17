import { FcException, HttpException, RpcException } from './exceptions';
import { ExceptionsService } from './exceptions.service';

describe('ExceptionsService', () => {
  describe('addLeadingZeros', () => {
    it('Should return a string', () => {
      // Given
      const value = 1;
      const length = 4;
      // When
      const result = ExceptionsService['addLeadingZeros'](value, length);
      // Then
      expect(typeof result).toBe('string');
    });
    it('should return the correct length', () => {
      // Given
      const value = 1;
      const length = 4;
      // When
      const result = ExceptionsService['addLeadingZeros'](value, length);
      // Then
      expect(result).toHaveLength(length);
    });
    it('should return the correct value', () => {
      // Given
      const value = 1;
      const length = 4;
      // When
      const result = ExceptionsService['addLeadingZeros'](value, length);
      // Then
      expect(result).toBe('0001');
    });
  });

  describe('getCode', () => {
    it('Should return a string', () => {
      // Given
      const scope = 1;
      const code = 2;
      // When
      const result = ExceptionsService['getCode'](scope, code);
      // Then
      expect(typeof result).toBe('string');
    });
    it('Should return the correct value for 1 digit code and 1 digit scope', () => {
      // Given
      const scope = 1;
      const code = 2;
      // When
      const result = ExceptionsService['getCode'](scope, code);
      // Then
      expect(result).toBe('Y010002');
    });
    it('Should return the correct value for 2 digits code and 2 digits scope', () => {
      // Given
      const scope = 23;
      const code = 12;
      // When
      const result = ExceptionsService['getCode'](scope, code);
      // Then
      expect(result).toBe('Y230012');
    });
    it('Should return the correct value for 3 digits code and 1 digits scope', () => {
      // Given
      const scope = 3;
      const code = 421;
      // When
      const result = ExceptionsService['getCode'](scope, code);
      // Then
      expect(result).toBe('Y030421');
    });
  });

  describe('getExceptionCodeFor', () => {
    it('should return the correct value from exception FcException', () => {
      // Given
      const exception = new FcException();
      exception.scope = 2;
      exception.code = 23;
      // When
      const result =
        ExceptionsService.getExceptionCodeFor<FcException>(exception);
      // Then
      expect(result).toBe('Y020023');
    });
    it('should return the correct value from exception HttpException', () => {
      // Given
      const exception = new HttpException('Not found', 404);
      // When
      const result =
        ExceptionsService.getExceptionCodeFor<HttpException>(exception);
      // Then
      expect(result).toBe('Y000404');
    });
    it('should return the correct value from exception RpcException', () => {
      // Given
      const exception = new RpcException('Foo');
      // When
      const result =
        ExceptionsService.getExceptionCodeFor<RpcException>(exception);
      // Then
      expect(result).toBe('Y000000');
    });
    it('should return the correct value from exception unknown', () => {
      // When
      const result = ExceptionsService.getExceptionCodeFor<Error>();
      // Then
      expect(result).toBe('Y000000');
    });
    it('Should call private method getCode', () => {
      // Given
      const getCodeMock = jest
        .spyOn(ExceptionsService as any, 'getCode')
        .mockReturnValueOnce('getCode return value');
      // When
      const result = ExceptionsService.getExceptionCodeFor<Error>();
      // Then
      expect(getCodeMock).toHaveBeenCalledTimes(1);
      expect(getCodeMock).toHaveBeenCalledWith(0, 0);
      expect(result).toBe('getCode return value');
    });
  });
});

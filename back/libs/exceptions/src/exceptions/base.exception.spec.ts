import { HttpException, HttpStatus } from '@nestjs/common';

import { BaseException } from './base.exception';

describe('BaseException', () => {
  it('should create an instance with default properties', () => {
    // When
    const exception = new BaseException();

    // Then
    expect(exception).toBeInstanceOf(BaseException);
    expect(exception).toBeInstanceOf(Error);
    expect(exception.originalError).toBeUndefined();
    expect(exception.status).toBeUndefined();
    expect(exception.message).toBe('');
  });

  it('should set message when input is a string', () => {
    // Given
    const message = 'Test error message';

    // When
    const exception = new BaseException(message);

    // Then
    expect(exception.message).toBe(message);
    expect(exception.originalError).toBeUndefined();
  });

  it('should set message and originalError when input is an Error', () => {
    const error = new Error('Inner error message');
    const exception = new BaseException(error);

    expect(exception.message).toBe(error.message);
    expect(exception.originalError).toBe(error);
  });

  it('should set status when input is an HttpException', () => {
    const httpException = new HttpException(
      'HTTP error message',
      HttpStatus.BAD_REQUEST,
    );
    const exception = new BaseException(httpException);

    expect(exception.message).toBe('HTTP error message');
    expect(exception.originalError).toBe(httpException);
    expect(exception.status).toBe(HttpStatus.BAD_REQUEST);
  });

  it('should have default HTTP_STATUS_CODE', () => {
    expect(BaseException.HTTP_STATUS_CODE).toBe(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  });

  it('should allow setting static properties', () => {
    BaseException.DOCUMENTATION = 'https://example.com';
    BaseException.UI = 'User interface string';
    BaseException.SCOPE = 1;
    BaseException.CODE = 1001;
    BaseException.LOG_LEVEL = 2;

    expect(BaseException.DOCUMENTATION).toBe('https://example.com');
    expect(BaseException.UI).toBe('User interface string');
    expect(BaseException.SCOPE).toBe(1);
    expect(BaseException.CODE).toBe(1001);
    expect(BaseException.LOG_LEVEL).toBe(2);
  });
});

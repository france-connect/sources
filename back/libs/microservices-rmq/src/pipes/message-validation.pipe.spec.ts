import { MicroservicesRmqBaseException } from '../exceptions/microservices-rmq-base.exception';
import { MicroservicesRmqMessageValidationPipe } from './message-validation.pipe';

describe('MicroservicesRmqMessageValidationPipe', () => {
  it('should be defined', () => {
    // When
    const pipe = new MicroservicesRmqMessageValidationPipe();

    // Then
    expect(pipe).toBeDefined();
  });

  it('should override the default options', () => {
    // When
    const pipe = new MicroservicesRmqMessageValidationPipe({
      forbidNonWhitelisted: false,
    });

    // Then
    expect(pipe['validatorOptions']).toEqual(
      expect.objectContaining({
        forbidNonWhitelisted: false,
        whitelist: true,
      }),
    );
  });

  it('should have an exception factory that throws an instance of MicroservicesRmqBaseException', () => {
    // Given
    const pipe = new MicroservicesRmqMessageValidationPipe();

    // When
    const exceptionFactory = pipe['exceptionFactory'];

    // Then
    expect(() => exceptionFactory([])).toThrow(MicroservicesRmqBaseException);
  });
});

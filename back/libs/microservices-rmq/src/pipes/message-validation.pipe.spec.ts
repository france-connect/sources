import { MicroservicesRmqBaseException } from '../exceptions/microservices-rmq-base.exception';
import { MicroservicesRmqMessageValidationPipe } from './message-validation.pipe';

describe('MicroservicesRmqMessageValidationPipe', () => {
  it('should be defined', () => {
    // When
    const pipe = new MicroservicesRmqMessageValidationPipe();

    // Then
    expect(pipe).toBeDefined();
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

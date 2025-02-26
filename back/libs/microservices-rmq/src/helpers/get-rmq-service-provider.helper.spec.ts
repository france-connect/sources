import { getRmqServiceProvider } from './get-rmq-service-provider.helper';

describe('getRmqServiceProvider', () => {
  const ServiceClass = class {};
  const serviceName = 'serviceName';

  it('should return provider', () => {
    // When
    const result = getRmqServiceProvider(ServiceClass, serviceName);

    // Then
    expect(result).toEqual({
      provide: serviceName,
      useFactory: expect.any(Function),
      inject: expect.any(Array),
    });
  });

  it('should return provider with default service name', () => {
    // When
    const result = getRmqServiceProvider(ServiceClass);

    // Then
    expect(result).toEqual({
      provide: 'ServiceClass',
      useFactory: expect.any(Function),
      inject: expect.any(Array),
    });
  });

  it('should return a factory that is injected with rmqService', () => {
    // Given
    const rmqService = { rmqService: 'rmqService' };
    const factory = getRmqServiceProvider(ServiceClass, serviceName).useFactory;

    // When
    const result = factory(rmqService);

    // Then
    expect(result).toBeInstanceOf(ServiceClass);
  });
});

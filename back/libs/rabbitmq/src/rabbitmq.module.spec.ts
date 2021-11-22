import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

import { RabbitmqModule } from './rabbitmq.module';

describe('RabbitmqModule', () => {
  const configServiceMock = {
    get: jest.fn(),
  };

  const configServiceReturnValue = Symbol('configServiceReturnValue');

  beforeEach(() => {
    jest.resetAllMocks();
    configServiceMock.get.mockReturnValue(configServiceReturnValue);
  });

  describe('registerFor', () => {
    it('should return a module declaration', () => {
      // Given
      const moduleNameMock = 'Foobar';
      // When
      const result = RabbitmqModule.registerFor(moduleNameMock);
      // Then
      expect(result).toBeInstanceOf(Object);
      expect(result).toHaveProperty('module');
      expect(result).toHaveProperty('providers');
      expect(result).toHaveProperty('exports');
    });
    it('should return a module with a provider for "<moduleName>Broker"', () => {
      // Given
      const moduleNameMock = 'Foobar';
      const module = RabbitmqModule.registerFor(moduleNameMock);
      // When
      const result = module.providers[0] as any;
      // Then
      expect(result).toHaveProperty('provide');
      expect(result.provide).toBe('FoobarBroker');
    });
    it('should return a module with a provider having a useFactory method', () => {
      // Given
      const moduleNameMock = 'Foobar';
      const module = RabbitmqModule.registerFor(moduleNameMock);
      // When
      const result = module.providers[0] as any;
      // Then
      expect(result).toHaveProperty('useFactory');
      expect(result.useFactory).toBeInstanceOf(Function);
    });
    it('should return a module with a provider having a useFactory calling ConfigService & ClientProxyFactory.Create', () => {
      // Given
      const moduleNameMock = 'Foobar';
      jest.spyOn(ClientProxyFactory, 'create').mockImplementation(() => {
        return {} as ClientProxy;
      });
      const module = RabbitmqModule.registerFor(moduleNameMock);
      const provider = module.providers[0] as any;
      // When
      provider.useFactory(configServiceMock);
      // Then
      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith('FoobarBroker');
      expect(ClientProxyFactory.create).toHaveBeenCalledTimes(1);
      expect(ClientProxyFactory.create).toHaveBeenCalledWith({
        transport: Transport.RMQ,
        options: configServiceReturnValue,
      });
    });
  });
});

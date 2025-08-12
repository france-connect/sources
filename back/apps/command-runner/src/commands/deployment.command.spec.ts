import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';

import { HelloService } from '../services';
import { DeploymentCommand } from './deployment.command';

describe('DeploymentCommand', () => {
  let command: DeploymentCommand;
  const loggerMock = getLoggerMock();
  const helloMock = { sayHello: jest.fn() };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [DeploymentCommand, HelloService, LoggerService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(HelloService)
      .useValue(helloMock)
      .compile();

    command = module.get<DeploymentCommand>(DeploymentCommand);
  });

  it('should be defined', () => {
    expect(command).toBeDefined();
  });

  describe('run', () => {
    it('should log no arg params', async () => {
      // When
      await command.run([]);

      // Then
      expect(loggerMock.info).toHaveBeenCalledTimes(3);
      expect(loggerMock.info).toHaveBeenNthCalledWith(
        1,
        '--- Début de la DeploymentCommand ---',
      );
      expect(loggerMock.info).toHaveBeenNthCalledWith(
        2,
        'Arguments reçus: aucun',
      );
      expect(loggerMock.info).toHaveBeenNthCalledWith(
        3,
        '--- Fin de DeploymentCommand ---',
      );
    });

    it('should log arg params', async () => {
      // Given
      const params = ['foo', 'bar'];

      // When
      await command.run(params);

      // Then
      expect(loggerMock.info).toHaveBeenNthCalledWith(
        2,
        `Arguments reçus: foo bar`,
      );
    });

    it('should call sayHello with undefined', async () => {
      // When
      await command.run([]);

      // Then
      expect(helloMock.sayHello).toHaveBeenCalledTimes(1);
      expect(helloMock.sayHello).toHaveBeenCalledWith(undefined);
    });

    it('should call sayHello with flag name', async () => {
      // Given
      const optionsMock = { name: 'Alice' };

      // When
      await command.run([], optionsMock);

      // Then
      expect(helloMock.sayHello).toHaveBeenCalledTimes(1);
      expect(helloMock.sayHello).toHaveBeenCalledWith('Alice');
    });
  });

  describe('parseName', () => {
    it('should return string', () => {
      // When
      const result = command.parseName('Alice');

      // Then
      expect(result).toEqual('Alice');
    });
  });
});

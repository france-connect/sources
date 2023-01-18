import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger-legacy';

import { MongooseConfig, MongooseConfigOptions } from '../dto';
import { NestJsConnection } from '../interfaces';
import { MongooseProvider } from './mongoose.provider';

describe('MongooseService', () => {
  const connectionNameMock = 'connectionNameValue';

  const configMock = {
    get: jest.fn(),
  } as unknown as ConfigService;

  const loggerMock = {
    setContext: jest.fn(),
    trace: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
  } as unknown as LoggerService;

  const eventBusMock = {
    publish: jest.fn(),
  };

  const connectionStringMock =
    'mongodb://userValue:passwordValue@hostsValue/databaseValue';

  const connectionMock = {
    close: jest.fn(),
    on: jest.fn(),
    $initialConnection: {
      catch: jest.fn(),
    },
  } as unknown as NestJsConnection;

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe('connectionFactory()', () => {
    beforeEach(() => {
      (
        connectionMock.$initialConnection.catch as jest.Mock
      ).mockReturnValueOnce(connectionMock.$initialConnection);
    });

    it('should register lifecycle events (connexion, disconnexion...) on connection', () => {
      // Given
      // When
      MongooseProvider['connectionFactory'](
        loggerMock,
        connectionNameMock,
        eventBusMock,
        connectionMock,
      );
      // Then
      expect(eventBusMock.publish).toHaveBeenCalledTimes(1);
      expect(connectionMock.on).toHaveBeenCalledTimes(3);
      expect(connectionMock.on).toHaveBeenNthCalledWith(
        1,
        'connected',
        expect.any(Function),
      );
      expect(connectionMock.on).toHaveBeenNthCalledWith(
        2,
        'disconnected',
        expect.any(Function),
      );
      expect(connectionMock.on).toHaveBeenNthCalledWith(
        3,
        'reconnected',
        expect.any(Function),
      );
    });

    it('should add catch handler to Mongoose connection', () => {
      // Given / When
      const connection = MongooseProvider['connectionFactory'](
        loggerMock,
        connectionNameMock,
        eventBusMock,
        connectionMock,
      );

      // Then
      expect(connection).toStrictEqual(connectionMock);
      expect(connectionMock.$initialConnection.catch).toHaveBeenCalledTimes(1);
    });

    it('should exit the app if connection failing happened', () => {
      // Given
      const processExit = jest
        .spyOn(process, 'exit')
        .mockImplementation((code) => code as never);

      const connection = MongooseProvider['connectionFactory'](
        loggerMock,
        connectionNameMock,
        eventBusMock,
        connectionMock,
      );

      // When
      const [catchFn] = (connection.$initialConnection.catch as jest.Mock).mock
        .calls[0];
      catchFn(new Error('Unknow Error'));

      // Then
      expect(processExit).toHaveBeenCalledTimes(1);
      expect(loggerMock.error).toHaveBeenCalledTimes(3);
      expect(loggerMock.error).toHaveBeenNthCalledWith(
        1,
        'Invalid Mongodb Connection for connectionNameValue',
      );
      expect(loggerMock.error).toHaveBeenNthCalledWith(2, '{}');
      expect(loggerMock.error).toHaveBeenNthCalledWith(3, 'Exiting app');
    });
  });

  describe('buildMongoParams()', () => {
    const configParams: MongooseConfig = {
      user: 'userValue',
      password: 'passwordValue',
      hosts: 'hostsValue',
      database: 'databaseValue',
      options: {
        options1: 'options1Value',
      } as unknown as MongooseConfigOptions,
    };

    const configFactoryMock = {
      uri: connectionStringMock,
      ...configParams.options,
      connectionFactory: expect.any(Function),
    };

    beforeEach(() => {
      (configMock.get as jest.Mock).mockReturnValueOnce(configParams);
    });

    it('should construct params with config options from connection name', () => {
      // When
      MongooseProvider.buildMongoParams(
        loggerMock,
        configMock,
        connectionNameMock,
        eventBusMock,
      );
      // Then
      expect(configMock.get).toHaveBeenCalledTimes(1);
      expect(configMock.get).toHaveBeenCalledWith(connectionNameMock);
    });

    it('should return the result from buildConnexion string and config options', () => {
      // When
      const result = MongooseProvider.buildMongoParams(
        loggerMock,
        configMock,
        connectionNameMock,
        eventBusMock,
      );
      // Then
      expect(result).toStrictEqual(configFactoryMock);
    });
  });
});

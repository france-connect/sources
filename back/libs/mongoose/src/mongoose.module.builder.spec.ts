import { mocked } from 'jest-mock';

import { MongooseModule } from '@nestjs/mongoose';

import { ConfigModule, ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger-legacy';

import { MongooseConfig, MongooseConfigOptions } from './dto';
import * as builder from './mongoose.module.builder';

jest.mock('@nestjs/mongoose');

describe('mongooseModuleBuilder', () => {
  const configMock = {
    get: jest.fn(),
  };

  const loggerMock = {
    trace: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
  } as unknown as LoggerService;

  const connectionStringMock =
    'mongodb://userValue:passwordValue@hostsValue/databaseValue';

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

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    configMock.get.mockReturnValue(configParams);
  });

  describe('connectionFactory()', () => {
    let connectionMock;
    beforeEach(() => {
      connectionMock = {
        $initialConnection: {
          catch: jest.fn(),
        },
      };
      connectionMock.$initialConnection.catch.mockReturnValueOnce(
        connectionMock.$initialConnection,
      );
    });

    it('should add catch handler to Mongoose connection', () => {
      // Given / When
      const connection = builder.connectionFactory(
        loggerMock,
        connectionStringMock,
        connectionMock,
      );

      // Then
      expect(connection).toStrictEqual(connectionMock);
      expect(connectionMock.$initialConnection.catch).toHaveBeenCalledTimes(1);
    });
    it('should exit the app if connection failing happened', async () => {
      // Given
      const processExit = jest
        .spyOn(process, 'exit')
        .mockImplementation((code) => code as never);

      const connection = builder.connectionFactory(
        loggerMock,
        connectionStringMock,
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
        'Invalid Mongodb Connection for mongodb://userValue:passwordValue@hostsValue/databaseValue',
      );
      expect(loggerMock.error).toHaveBeenNthCalledWith(2, '{}');
      expect(loggerMock.error).toHaveBeenNthCalledWith(3, 'Exiting app');
    });
  });

  describe('buildFactoryParams()', () => {
    it('should return the result from buildConnexion string and config options', () => {
      // Given / When
      const result = builder.buildFactoryParams(
        loggerMock as unknown as LoggerService,
        configParams,
      );
      // Then
      expect(result).toStrictEqual(configFactoryMock);
    });
  });

  describe('mongooseModuleBuilder()', () => {
    const dynamicModuleMock = Symbol('dynamicModule');
    const configBuilderMock = Symbol('configData');
    let mongooseMock;
    let buildFactoryMock;

    beforeEach(async () => {
      mongooseMock = mocked(MongooseModule.forRootAsync);
      mongooseMock.mockReturnValueOnce(dynamicModuleMock);

      buildFactoryMock = jest.spyOn(builder, 'buildFactoryParams');
      buildFactoryMock.mockReturnValueOnce(configBuilderMock);
    });

    it('should get Dynamic Module from config', async () => {
      // Given / When
      const mongooseModuleGenerated = builder.mongooseModuleBuilder();

      // Then
      expect(mongooseModuleGenerated).toEqual(dynamicModuleMock);
    });

    it('should build Mongoose Module with useFactory', async () => {
      // Given / When
      builder.mongooseModuleBuilder();

      // Then
      expect(mongooseMock).toHaveBeenCalledTimes(1);
      expect(mongooseMock).toHaveBeenCalledWith({
        imports: [ConfigModule],
        inject: [LoggerService, ConfigService],
        useFactory: expect.any(Function),
      });
    });

    it('should get params if the useFactory is called', async () => {
      // Given
      builder.mongooseModuleBuilder();
      const [config] = mongooseMock.mock.calls[0];

      // When
      const result = config.useFactory(loggerMock, configMock);

      // Then
      expect(mongooseMock).toHaveBeenCalledTimes(1);
      expect(buildFactoryMock).toHaveBeenCalledTimes(1);
      expect(buildFactoryMock).toHaveBeenCalledWith(loggerMock, configParams);
      expect(result).toStrictEqual(configBuilderMock);
    });

    it('should get params from the useFactory with specific config name', async () => {
      // Given
      const configName = 'Sarah Connor';
      builder.mongooseModuleBuilder(configName);
      const [config] = mongooseMock.mock.calls[0];

      // When
      const result = config.useFactory(loggerMock, configMock);

      // Then
      expect(result).toBeDefined();
      expect(configMock.get).toHaveBeenCalledTimes(1);
      expect(configMock.get).toHaveBeenCalledWith(configName);
    });
  });
});

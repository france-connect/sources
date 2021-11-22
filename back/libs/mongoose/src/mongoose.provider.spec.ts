import { ConfigService } from '@fc/config';

import { buildConnectionString, buildFactoryParams } from './mongoose.provider';

describe('mongooseProvider', () => {
  const configMock = {
    get: jest.fn(),
  };

  const configOptionsMock = { foo: 'optionsMockValue' };
  const connectionStringMock =
    'mongodb://userMockValue:passwordMockValue@hostsMockValue/databaseMockValue';

  const mongoConfigMock = {
    user: 'userMockValue',
    password: 'passwordMockValue',
    hosts: 'hostsMockValue',
    database: 'databaseMockValue',
    options: configOptionsMock,
  };

  beforeEach(() => {
    jest.resetAllMocks();
    configMock.get.mockReturnValue(mongoConfigMock);
  });

  describe('buildConnectionString', () => {
    it('should call config and return a mongo connection uri', () => {
      // When
      const result = buildConnectionString(
        configMock as unknown as ConfigService,
      );
      // Then
      expect(configMock.get).toHaveBeenCalledTimes(1);
      expect(configMock.get).toHaveBeenCalledWith('Mongoose');
      expect(result).toBe(connectionStringMock);
    });
  });

  describe('buildFactoryParams', () => {
    it('should return the result from buildConnexion string and config options', () => {
      // When
      const result = buildFactoryParams(configMock as unknown as ConfigService);
      // Then
      expect(result).toEqual({
        uri: connectionStringMock,
        ...configOptionsMock,
      });
    });
  });
});

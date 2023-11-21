import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger-legacy';
import { OidcSession } from '@fc/oidc';
import {
  OidcProviderMiddlewareStep,
  OidcProviderRoutes,
  OidcProviderService,
} from '@fc/oidc-provider';
import { ServiceProviderAdapterEnvService } from '@fc/service-provider-adapter-env';
import { ISessionBoundContext, SessionService } from '@fc/session';

import {
  getFilesPathsFromDir,
  parseCsv,
  removeEmptyProperties,
  transformColumnsIntoBoolean,
} from '../helpers';
import { MockIdentityProviderService } from './mock-identity-provider.service';

jest.mock('../helpers');

describe('MockIdentityProviderService', () => {
  let service: MockIdentityProviderService;

  const loggerMock = {
    debug: jest.fn(),
    fatal: jest.fn(),
    setContext: jest.fn(),
  };

  const sessionServiceMock = {
    set: {
      bind: jest.fn(),
    },
  };

  const serviceProviderEnvServiceMock = {
    getList: jest.fn(),
    getById: jest.fn(),
  };

  const getInteractionMock = jest.fn();

  const sessionIdValueMock = '42';
  const interactionIdValueMock = '42';

  const oidcProviderServiceMock = {
    getInteraction: getInteractionMock,
    registerMiddleware: jest.fn(),
    getInteractionIdFromCtx: jest.fn(),
  };

  const configServiceMock = {
    get: jest.fn(),
  };

  const citizenDatabasePathMock = '/eur';
  const csvBooleanColumnsMock = ['is_service_public'];

  const fastCsvOptsMock = {
    trim: true,
    ignoreEmpty: true,
    headers: true,
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoggerService,
        OidcProviderService,
        MockIdentityProviderService,
        ServiceProviderAdapterEnvService,
        SessionService,
        ConfigService,
      ],
    })
      .overrideProvider(OidcProviderService)
      .useValue(oidcProviderServiceMock)
      .overrideProvider(ServiceProviderAdapterEnvService)
      .useValue(serviceProviderEnvServiceMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .compile();

    service = module.get<MockIdentityProviderService>(
      MockIdentityProviderService,
    );
  });

  describe('onModuleInit()', () => {
    let loadDatabasesMock: jest.Mock;
    beforeEach(() => {
      loadDatabasesMock = service['loadDatabases'] = jest.fn();
    });
    it('should call loadDatabase', async () => {
      // Given
      // When
      await service.onModuleInit();
      // Then
      expect(loadDatabasesMock).toHaveBeenCalledTimes(1);
    });

    it('should register oidc provider middleware', async () => {
      // Given
      // When
      await service.onModuleInit();
      // Then
      expect(oidcProviderServiceMock.registerMiddleware).toHaveBeenCalledTimes(
        1,
      );
      expect(oidcProviderServiceMock.registerMiddleware).toHaveBeenCalledWith(
        OidcProviderMiddlewareStep.AFTER,
        OidcProviderRoutes.AUTHORIZATION,
        expect.any(Function),
      );
    });
  });

  describe('loadDatabases()', () => {
    const csvMock1 = [
      { property1: '1', property2: '2', property3: '3', property4: '4' },
      { property1: '5', property2: '6', property3: '7', property4: '8' },
    ];

    const csvMock2 = [
      { property1: '1', property2: '2', property3: '3', property4: '4' },
      { property1: '5', property2: '6', property3: '7', property4: '8' },
    ];

    const csvMock3 = [
      { property1: '1', property2: '2', property3: '3', property4: '4' },
      { property1: '5', property2: '6', property3: '7', property4: '8' },
    ];

    const pathsMock = ['path1', 'path2', 'path3'];
    let loadDatabaseMock: jest.Mock;

    beforeEach(() => {
      configServiceMock.get.mockReturnValueOnce({
        citizenDatabasePath: citizenDatabasePathMock,
        csvBooleanColumns: csvBooleanColumnsMock,
      });
      jest.mocked(getFilesPathsFromDir).mockResolvedValueOnce(pathsMock);

      loadDatabaseMock = service['loadDatabase'] = jest.fn();
      loadDatabaseMock
        .mockResolvedValueOnce(csvMock1)
        .mockResolvedValueOnce(csvMock2)
        .mockResolvedValueOnce(csvMock3);
    });

    it('should get citizenDatabasePath from App config', async () => {
      // When
      await service['loadDatabases']();

      // Then
      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith('App');
    });

    it('should get files path from directory', async () => {
      // When
      await service['loadDatabases']();

      // Then
      expect(jest.mocked(getFilesPathsFromDir)).toHaveBeenCalledTimes(1);
      expect(jest.mocked(getFilesPathsFromDir)).toHaveBeenCalledWith(
        citizenDatabasePathMock,
      );
    });
    it('should load every database from file paths', async () => {
      // When
      await service['loadDatabases']();

      // Then
      expect(loadDatabaseMock).toHaveBeenCalledTimes(3);
      expect(loadDatabaseMock).toHaveBeenNthCalledWith(1, pathsMock[0]);
      expect(loadDatabaseMock).toHaveBeenNthCalledWith(2, pathsMock[1]);
      expect(loadDatabaseMock).toHaveBeenNthCalledWith(3, pathsMock[2]);
    });

    it('should load database from all file in directory', async () => {
      // Given
      service['database'] = null;
      const databaseMock = [...csvMock1, ...csvMock2, ...csvMock3];
      // When
      await service['loadDatabases']();

      // Then
      expect(service['database']).toStrictEqual(databaseMock);
    });
  });

  describe('loadDatabase()', () => {
    beforeEach(() => {
      configServiceMock.get.mockReturnValueOnce({
        csvBooleanColumns: csvBooleanColumnsMock,
      });
    });

    const csvMock = [
      { property1: '1', property2: '2', property3: '3', property4: '4' },
      { property1: '5', property2: '6', property3: '7', property4: '8' },
    ];

    const pathMock = 'pathMockValue';

    it('should call parseCsv() with path, trim, ignoreEmpty and headers', async () => {
      // Given
      jest.mocked(parseCsv).mockResolvedValueOnce(csvMock);
      // When
      await service['loadDatabase'](pathMock);

      // Then
      expect(jest.mocked(parseCsv)).toHaveBeenCalledTimes(1);
      expect(jest.mocked(parseCsv)).toHaveBeenCalledWith(
        pathMock,
        fastCsvOptsMock,
      );
    });

    it('should filter out the empty keys in CSV entry with removeEmptyProperties', async () => {
      // Given
      const csvWithEmptyMock = [
        {
          property1: '1',
          property2: '2',
          property3: '',
          property4: '4',
        },
        {
          property1: '',
          property2: '6',
          property3: '7',
          property4: '8',
        },
      ];

      const cleanedMock = [
        { property1: '1', property2: '2', property4: '4' },
        { property2: '6', property3: '7', property4: '8' },
      ];

      jest.mocked(parseCsv).mockResolvedValueOnce(csvWithEmptyMock);
      jest.mocked(removeEmptyProperties).mockReturnValueOnce(cleanedMock);

      // When
      await service['loadDatabase'](pathMock);

      // Then
      expect(jest.mocked(parseCsv)).toHaveBeenCalledTimes(1);
      expect(jest.mocked(removeEmptyProperties)).toHaveBeenCalledTimes(1);
      expect(jest.mocked(removeEmptyProperties)).toHaveBeenCalledWith(
        csvWithEmptyMock,
      );
    });

    it('should transform the selected properties in boolean with transformColumnsIntoBoolean', async () => {
      // Given
      const csvWithEmptyMock = [
        {
          property1: '1',
          property2: '2',
          property3: '3',
          isBoolean: 'true',
        },
        {
          property1: '',
          property2: '6',
          property3: '7',
          isBoolean: 'false',
        },
      ];

      const cleanedMock = [
        {
          property1: '1',
          property2: '2',
          property3: '3',
          // is_service_public is a moncomptepro variable name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          is_service_public: 'true',
        },
        {
          property1: '6',
          property2: '7',
          property3: '8',
          // is_service_public is a moncomptepro variable name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          is_service_public: 'false',
        },
      ];

      const expectedMock = [
        {
          property1: '1',
          property2: '2',
          property3: '3',
          // is_service_public is a moncomptepro variable name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          is_service_public: 'true',
        },
        {
          property1: '6',
          property2: '7',
          property3: '8',
          // is_service_public is a moncomptepro variable name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          is_service_public: 'false',
        },
      ];

      jest.mocked(parseCsv).mockResolvedValueOnce(csvWithEmptyMock);
      jest.mocked(removeEmptyProperties).mockReturnValueOnce(cleanedMock);
      jest
        .mocked(transformColumnsIntoBoolean)
        .mockReturnValueOnce(expectedMock);

      // When
      const database = await service['loadDatabase'](pathMock);

      // Then
      expect(jest.mocked(parseCsv)).toHaveBeenCalledTimes(1);
      expect(jest.mocked(removeEmptyProperties)).toHaveBeenCalledTimes(1);
      expect(jest.mocked(transformColumnsIntoBoolean)).toHaveBeenCalledTimes(1);
      expect(jest.mocked(transformColumnsIntoBoolean)).toHaveBeenCalledWith(
        expectedMock,
        ['is_service_public'],
      );

      expect(database).toStrictEqual(expectedMock);
    });

    it('should log error when something turns bad', async () => {
      // Given
      const errorMock = new Error();
      jest.mocked(parseCsv).mockRejectedValueOnce(errorMock);

      // When / Then
      await expect(service['loadDatabase'](pathMock)).rejects.toThrow(
        errorMock,
      );
    });
  });

  describe('shouldAbortMiddleware', () => {
    it('should return true if oidc has an error', () => {
      // Given
      const ctxMock = {
        oidc: {
          isError: true,
          entities: {
            AuthorizationCode: Symbol('authorizationCode'),
          },
        },
      };
      // When
      const result = service['shouldAbortMiddleware'](ctxMock);
      // Then
      expect(result).toBeTrue();
    });

    it('should return true if oidc has already an AuthorizationCode params', () => {
      // Given
      const ctxMock = {
        oidc: {
          isError: false,
          entities: {
            AuthorizationCode: Symbol('authorizationCode'),
          },
        },
      };
      // When
      const result = service['shouldAbortMiddleware'](ctxMock);
      // Then
      expect(result).toBeTrue();
    });

    it('should return false if oidc has neither an error neither an AuthorizationCode params', () => {
      // Given
      const ctxMock = {
        oidc: {
          entities: {},
        },
      };
      // When
      const result = service['shouldAbortMiddleware'](ctxMock);
      // Then
      expect(result).toBeFalse();
    });
  });

  describe('authorizationMiddleware()', () => {
    const spNameMock = 'spNameValue';
    const spAcrMock = 'eidas3';
    const clientIdMock = 'clientIdValue';
    const ctxMock = {
      req: {
        sessionId: sessionIdValueMock,
        headers: { 'x-forwarded-for': '123.123.123.123' },
      },
      oidc: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        params: { client_id: clientIdMock, acr_values: spAcrMock },
      },
      res: {},
    };

    let shouldAbortMock;

    beforeEach(() => {
      shouldAbortMock = service['shouldAbortMiddleware'] = jest.fn();
    });

    it('should abort middleware execution if request if flagged as erroring', async () => {
      // Given
      shouldAbortMock.mockReturnValueOnce(true);

      // When
      await service['authorizationMiddleware'](ctxMock);

      // Then
      expect(
        oidcProviderServiceMock.getInteractionIdFromCtx,
      ).toHaveBeenCalledTimes(0);
      expect(serviceProviderEnvServiceMock.getById).toHaveBeenCalledTimes(0);

      expect(sessionServiceMock.set.bind).toHaveBeenCalledTimes(0);
    });

    it('should call session.set()', async () => {
      // Given
      shouldAbortMock.mockReturnValueOnce(false);

      oidcProviderServiceMock.getInteractionIdFromCtx.mockReturnValue(
        interactionIdValueMock,
      );

      serviceProviderEnvServiceMock.getById.mockReturnValueOnce({
        name: spNameMock,
      });

      const bindedSessionService = jest.fn().mockResolvedValueOnce(undefined);
      sessionServiceMock.set.bind.mockReturnValueOnce(bindedSessionService);

      const boundSessionContextMock: ISessionBoundContext = {
        sessionId: sessionIdValueMock,
        moduleName: 'OidcClient',
      };

      const sessionMock: OidcSession = {
        /** The first time, the client id comes from the authorize request not the session */
        spId: clientIdMock,
        spAcr: spAcrMock,
        spName: spNameMock,
        interactionId: interactionIdValueMock,
      };

      // When
      await service['authorizationMiddleware'](ctxMock);

      // Then
      expect(sessionServiceMock.set.bind).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.set.bind).toHaveBeenCalledWith(
        sessionServiceMock,
        boundSessionContextMock,
      );

      expect(bindedSessionService).toHaveBeenCalledTimes(1);
      expect(bindedSessionService).toHaveBeenCalledWith(sessionMock);
    });

    it('should throw if the session initialization fails', async () => {
      // Given
      shouldAbortMock.mockReturnValueOnce(false);

      oidcProviderServiceMock.getInteractionIdFromCtx.mockReturnValue(
        interactionIdValueMock,
      );
      sessionServiceMock.set.bind.mockRejectedValueOnce(new Error('test'));

      // Then
      await expect(
        service['authorizationMiddleware'](ctxMock),
      ).rejects.toThrow();
    });
  });

  describe('getIdentity()', () => {
    it('should return the correct idp', () => {
      // Given
      const entryA = { login: 'entryAValue', param: '1' };
      const entryB = { login: 'entryBValue', param: '1' };
      const entryC = { login: 'entryCValue', param: '1' };
      const expected = {
        // sha256 hash of 'entryBValue'
        sub: '4673cf1ea2bd90252f368d9eb3237f2e0f1669e695e03e432e9715606d89fb69',
        param: '1',
      };

      service['database'] = [entryA, entryB, entryC];
      const inputLogin = entryB.login;
      // When
      const result = service.getIdentity(inputLogin);

      // Then
      expect(result).toStrictEqual(expected);
    });

    it('should return undefined if not present', () => {
      // Given
      const entryA = { login: 'entryAValue', param: '1' };
      const entryB = { login: 'entryBValue', param: '1' };
      const entryC = { login: 'entryCValue', param: '1' };

      service['database'] = [entryA, entryB, entryC];
      const inputLogin = 'foo';
      // When
      const result = service.getIdentity(inputLogin);

      // Then
      expect(result).toStrictEqual(undefined);
    });
  });

  describe('isPasswordValid()', () => {
    beforeEach(() => {
      configServiceMock.get.mockReturnValue({ passwordVerification: true });
    });

    it('should return true if password check is enabled and password is valid', () => {
      // Given
      configServiceMock.get.mockReturnValueOnce({ passwordVerification: true });
      const password = 'password';
      const inputPassword = 'password';

      // When
      const result = service.isPasswordValid(password, inputPassword);

      // Then
      expect(result).toBe(true);
    });

    it('should return false if password check is enabled and password is invalid', () => {
      // Given
      configServiceMock.get.mockReturnValueOnce({ passwordVerification: true });
      const password = 'password';
      const inputPassword = 'foo';

      // When
      const result = service.isPasswordValid(password, inputPassword);

      // Then
      expect(result).toBe(false);
    });

    it('should return true if password check is disabled even if password is invalid', () => {
      // Given
      configServiceMock.get.mockReturnValueOnce({
        passwordVerification: false,
      });
      const password = 'password';
      const inputPassword = 'foo';

      // When
      const result = service.isPasswordValid(password, inputPassword);

      // Then
      expect(result).toBe(true);
    });
  });

  describe('toOidcFormat', () => {
    it('should replace the "login" property by "sub" and return the OidcClaims', () => {
      // setup
      const csvObject = {
        login: '42',
        key: 'value',
      };
      const expected = {
        // sha256 hash of '42'
        sub: '73475cb40a568e8da8a045ced110137e159f890ac4da883b6b17dc651b3a8049',
        key: 'value',
      };

      // action
      const result = service['toOidcFormat'](csvObject);

      //expect
      expect(result).toStrictEqual(expected);
    });

    it('should call oidcAddressFieldPresent with the current Csv', () => {
      // setup
      const csvObject = {
        login: '42',
        key: 'value',
      };
      const expected = {
        // sha256 hash of '42'
        sub: '73475cb40a568e8da8a045ced110137e159f890ac4da883b6b17dc651b3a8049',
        key: 'value',
      };
      service['oidcAddressFieldPresent'] = jest.fn();

      // action
      service['toOidcFormat'](csvObject);

      //expect
      expect(service['oidcAddressFieldPresent']).toHaveBeenCalledTimes(1);
      expect(service['oidcAddressFieldPresent']).toHaveBeenCalledWith(expected);
    });

    it('should not call "formatOidcAddress" if there is no address', () => {
      // setup
      const csvObject = {
        login: '42',
        key: 'value',
      };
      service['formatOidcAddress'] = jest.fn();

      // action
      service['toOidcFormat'](csvObject);

      //expect
      expect(service['formatOidcAddress']).toHaveBeenCalledTimes(0);
    });

    it('should call "formatOidcAddress" with the Csv containing the sub if there is an address', () => {
      // setup
      const csvObject = {
        login: '42',
        key: 'value',
        country: 'North Korea',
        // oidc claim
        // eslint-disable-next-line @typescript-eslint/naming-convention
        postal_code: '99999',
        locality: 'Pyongyang',
        // oidc claim
        // eslint-disable-next-line @typescript-eslint/naming-convention
        street_address: '1 st street',
      };
      const expected = {
        // sha256 hash of '42'
        sub: '73475cb40a568e8da8a045ced110137e159f890ac4da883b6b17dc651b3a8049',
        key: 'value',
        country: 'North Korea',
        // oidc claim
        // eslint-disable-next-line @typescript-eslint/naming-convention
        postal_code: '99999',
        locality: 'Pyongyang',
        // oidc claim
        // eslint-disable-next-line @typescript-eslint/naming-convention
        street_address: '1 st street',
      };
      service['formatOidcAddress'] = jest.fn();

      // action
      service['toOidcFormat'](csvObject);

      //expect
      expect(service['formatOidcAddress']).toHaveBeenCalledTimes(1);
      expect(service['formatOidcAddress']).toHaveBeenCalledWith(expected);
    });

    it('should return the OidcClaims object with the formatted address', () => {
      // setup
      const csvObject = {
        login: '42',
        key: 'value',
        country: 'North Korea',
        // oidc claim
        // eslint-disable-next-line @typescript-eslint/naming-convention
        postal_code: '99999',
        locality: 'Pyongyang',
        // oidc claim
        // eslint-disable-next-line @typescript-eslint/naming-convention
        street_address: '1 st street',
      };
      const expected = {
        // sha256 hash of '42'
        sub: '73475cb40a568e8da8a045ced110137e159f890ac4da883b6b17dc651b3a8049',
        key: 'value',
        address: {
          country: 'North Korea',
          // oidc claim
          // eslint-disable-next-line @typescript-eslint/naming-convention
          postal_code: '99999',
          locality: 'Pyongyang',
          // oidc claim
          // eslint-disable-next-line @typescript-eslint/naming-convention
          street_address: '1 st street',
          formatted: 'North Korea Pyongyang 99999 1 st street',
        },
      };

      // action
      const result = service['toOidcFormat'](csvObject);

      //expect
      expect(result).toStrictEqual(expected);
    });

    it('should not alter the parameter', () => {
      // setup
      const csvObject = {
        login: '42',
        key: 'value',
      };
      const expected = {
        login: '42',
        key: 'value',
      };

      // action
      service['toOidcFormat'](csvObject);

      //expect
      expect(csvObject).toStrictEqual(expected);
    });
  });

  describe('oidcAddressFieldPresent', () => {
    it('should return true if the "country" field is present', () => {
      // setup
      const csvObject = {
        sub: '42',
        key: 'value',
        country: 'North Korea',
      };

      // action
      const result = service['oidcAddressFieldPresent'](csvObject);

      // expect
      expect(result).toBe(true);
    });

    it('should return true if the "postal_code" field is present', () => {
      // setup
      const csvObject = {
        sub: '42',
        key: 'value',
        // oidc claim
        // eslint-disable-next-line @typescript-eslint/naming-convention
        postal_code: '99999',
      };

      // action
      const result = service['oidcAddressFieldPresent'](csvObject);

      // expect
      expect(result).toBe(true);
    });

    it('should return true if the "locality" field is present', () => {
      // setup
      const csvObject = {
        sub: '42',
        key: 'value',
        locality: 'Pyongyang',
      };

      // action
      const result = service['oidcAddressFieldPresent'](csvObject);

      // expect
      expect(result).toBe(true);
    });

    it('should return true if the "street_address" field is present', () => {
      // setup
      const csvObject = {
        sub: '42',
        key: 'value',
        // oidc claim
        // eslint-disable-next-line @typescript-eslint/naming-convention
        street_address: '1 st street',
      };

      // action
      const result = service['oidcAddressFieldPresent'](csvObject);

      // expect
      expect(result).toBe(true);
    });
  });
});

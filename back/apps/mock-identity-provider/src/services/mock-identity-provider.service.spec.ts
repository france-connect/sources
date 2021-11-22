import { CsvParserStream, parseFile, Row } from '@fast-csv/parse';
import { PassThrough } from 'stream';
import { mocked } from 'ts-jest/utils';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';
import { OidcSession } from '@fc/oidc';
import { OidcProviderService } from '@fc/oidc-provider';
import { ServiceProviderAdapterEnvService } from '@fc/service-provider-adapter-env';
import { ISessionBoundContext, SessionService } from '@fc/session';

import { MockIdentityProviderService } from './mock-identity-provider.service';

jest.mock('@fast-csv/parse');

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
  const fastCsvOptsMock = {
    trim: true,
    ignoreEmpty: true,
    headers: true,
  };

  beforeEach(async () => {
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

    jest.resetAllMocks();
  });

  describe('onModuleInit()', () => {
    it('should call loadDatabase', () => {
      // Given
      service['loadDatabase'] = jest.fn();
      // When
      service.onModuleInit();
      // Then
      expect(service['loadDatabase']).toHaveBeenCalledTimes(1);
    });
  });

  describe('loadDatabase()', () => {
    const csvMock = [
      { property1: '1', property2: '2', property3: '3', property4: '4' },
      { property1: '5', property2: '6', property3: '7', property4: '8' },
    ];

    beforeEach(() => {
      configServiceMock.get.mockReturnValueOnce({
        citizenDatabasePath: citizenDatabasePathMock,
      });
      service['parseCsv'] = jest.fn().mockResolvedValueOnce(csvMock);
    });

    it('should get citizenDatabasePath from App config', async () => {
      // When
      await service['loadDatabase']();

      // Then
      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith('App');
    });

    it('should call parseCsv() with citizenDatabasePath, trim, ignoreEmpty and headers', async () => {
      // When
      await service['loadDatabase']();

      // Then
      expect(service['parseCsv']).toHaveBeenCalledTimes(1);
      expect(service['parseCsv']).toHaveBeenCalledWith(
        citizenDatabasePathMock,
        fastCsvOptsMock,
      );
    });

    it('should filter out the empty keys in CSV entry', async () => {
      // Given
      const csvWithEmptyMock = [
        { property1: '1', property2: '2', property3: '', property4: '4' },
        { property1: '', property2: '6', property3: '7', property4: '8' },
      ];
      const expected = [
        { property1: '1', property2: '2', property4: '4' },
        { property2: '6', property3: '7', property4: '8' },
      ];
      service['parseCsv'] = jest.fn().mockResolvedValueOnce(csvWithEmptyMock);

      // When
      await service['loadDatabase']();

      // Then
      expect(service['database']).toStrictEqual(expected);
    });

    it('should store the result of filtered parseCsv() call into service.database', async () => {
      // When
      await service['loadDatabase']();

      // Then
      expect(service['database']).toStrictEqual(csvMock);
    });

    it('should log error when something turns bad', async () => {
      // Given
      const errorMock = new Error();
      service['parseCsv'] = jest.fn().mockRejectedValueOnce(errorMock);

      // When / Then
      await expect(service['loadDatabase']()).rejects.toThrow(errorMock);
    });
  });

  describe('authorizationMiddleware()', () => {
    const spNameMock = 'spNameValue';
    const spAcrMock = 'eidas3';
    const clientIdMock = 'clientIdValue';
    const getCtxMock = (hasError = false) => {
      return {
        req: {
          sessionId: sessionIdValueMock,
          headers: { 'x-forwarded-for': '123.123.123.123' },
        },
        oidc: {
          isError: hasError,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          params: { client_id: clientIdMock, acr_values: spAcrMock },
        },
        res: {},
      };
    };

    it('should abort middleware execution if request if flagged as erroring', () => {
      // Given
      const ctxMock = getCtxMock(true);

      // When
      service['authorizationMiddleware'](ctxMock);

      // Then
      expect(
        oidcProviderServiceMock.getInteractionIdFromCtx,
      ).toHaveBeenCalledTimes(0);
      expect(serviceProviderEnvServiceMock.getById).toHaveBeenCalledTimes(0);

      expect(sessionServiceMock.set.bind).toHaveBeenCalledTimes(0);
    });

    it('should call session.set()', async () => {
      // Given
      const ctxMock = getCtxMock();
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
      const ctxMock = getCtxMock();
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

  describe('parseCsv()', () => {
    const parseFileMock = mocked(parseFile);
    let streamMock;

    beforeEach(() => {
      streamMock = new PassThrough();
      parseFileMock.mockReturnValueOnce(
        streamMock as CsvParserStream<Row<any>, Row<any>>,
      );
    });

    it('should call parseFile() with citizenDatabasePathMock and fastCsvOptsMock', async () => {
      // Given
      streamMock.end();

      // When
      await service['parseCsv'](citizenDatabasePathMock, fastCsvOptsMock);

      // Then
      expect(parseFileMock).toHaveBeenCalledTimes(1);
      expect(parseFileMock).toHaveBeenCalledWith(
        citizenDatabasePathMock,
        fastCsvOptsMock,
      );
    });

    it('should resolve with rows passed through "data" event emission', async () => {
      // Given
      const rowsMock = [
        ['1', '2', '3', '4'],
        ['5', '6', '7', '8'],
      ];
      const csvPromise = service['parseCsv'](
        citizenDatabasePathMock,
        fastCsvOptsMock,
      );
      streamMock.emit('data', rowsMock[0]);
      streamMock.emit('data', rowsMock[1]);
      streamMock.end();

      // When
      const result = await csvPromise;

      // Then
      expect(result).toStrictEqual(rowsMock);
      streamMock.destroy();
    });

    it('should reject with error passed through "error" event emission', async () => {
      // Given
      const errorMock = new Error('HAHA !');
      const csvPromise = service['parseCsv'](
        citizenDatabasePathMock,
        fastCsvOptsMock,
      );
      streamMock.emit('error', errorMock);

      // When / Then
      await expect(() => csvPromise).rejects.toThrow(errorMock);
      streamMock.destroy();
    });
  });
});

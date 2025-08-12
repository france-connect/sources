import { Test, TestingModule } from '@nestjs/testing';

import { splitInTwoParts, validateDto } from '@fc/common';
import { ConfigService } from '@fc/config';
import { CreatedVia } from '@fc/csmr-config-client';
import { CsmrImportCoreServiceProviderDto } from '@fc/csmr-import-core-client';
import { LoggerService } from '@fc/logger';
import { ScopesService } from '@fc/scopes';
import { ClientTypeEnum, SignatureAlgorithmEnum } from '@fc/service-provider';

import { getConfigMock } from '@mocks/config';
import { getLoggerMock } from '@mocks/logger';

import { Status } from '../enums';
import { CsmrImportCoreServiceProviderInterface } from '../interfaces';
import { CONFIG_DATABASE_SERVICE } from '../tokens';
import { CsmrImportCoreService } from './csmr-import-core.service';

jest.mock('@fc/common', () => ({
  ...jest.requireActual('@fc/common'),
  splitInTwoParts: jest.fn(),
  validateDto: jest.fn(),
}));

describe('CsmrImportCoreService', () => {
  let service: CsmrImportCoreService;

  const splitInTwoPartsMock = jest.mocked(splitInTwoParts);
  const validateDtoMock = jest.mocked(validateDto);

  const configServiceMock = getConfigMock();
  const loggerServiceMock = getLoggerMock();

  const configDatabaseMock = {
    create: jest.fn(),
    findOneSpByQuery: jest.fn(),
  };

  const csmrHsmClientMock = {
    random: jest.fn(),
  };

  const scopesServiceMock = {
    getRawClaimsFromScopes: jest.fn(),
    getScopesFromClaims: jest.fn(),
  };

  const payloadMock = Symbol('payload');
  const payloadEncodingMock = Symbol('utf8');

  const userMock = 'userMock';
  const serviceProviderMock = [
    {
      name: 'nameMock 1',
    },
  ] as unknown as CsmrImportCoreServiceProviderInterface[];
  const validateDtoErrorMock = [{ property: 'invalid param' }];

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CsmrImportCoreService,
        LoggerService,
        ConfigService,
        {
          provide: CONFIG_DATABASE_SERVICE,
          useValue: configDatabaseMock,
        },
        {
          provide: 'CsmrHsmClient',
          useValue: csmrHsmClientMock,
        },
        ScopesService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(ScopesService)
      .useValue(scopesServiceMock)
      .compile();

    service = module.get<CsmrImportCoreService>(CsmrImportCoreService);

    csmrHsmClientMock.random.mockResolvedValueOnce({
      payload: payloadMock,
    });

    splitInTwoPartsMock.mockReturnValueOnce(['client_id', 'client_secret']);
    validateDtoMock.mockResolvedValueOnce(validateDtoErrorMock);
  });

  describe('validateAndCreateServiceProvider', () => {
    const reporSuccesstMock = {
      client_id: 'client_id',
      client_secret: 'client_secret',
      comments: 'Service provider created',
      name: 'nameMock 1',
      status: Status.SUCCESS,
    };

    beforeEach(() => {
      service['validateIfDuplicateSp'] = jest
        .fn()
        .mockReturnValueOnce(undefined);
      service['validateSpConfiguration'] = jest
        .fn()
        .mockResolvedValueOnce(false);
      service['validateIfSpAlreadyExists'] = jest
        .fn()
        .mockResolvedValueOnce(null);
      service['buildServiceProviderPayload'] = jest
        .fn()
        .mockReturnValueOnce(payloadMock);
      service['getCredentials'] = jest.fn().mockReturnValueOnce({
        client_id: 'client_id',
        client_secret: 'client_secret',
      });
      service['buildExecutionReport'] = jest
        .fn()
        .mockReturnValueOnce(reporSuccesstMock);
    });

    it('should return error report if errors due to duplicate datapass or entityId are found', async () => {
      // Given
      const reportMock = {
        client_id: '',
        client_secret: '',
        comments: 'duplicate datapassId',
        name: 'nameMock 1',
        status: Status.ERROR,
      };

      service['validateIfDuplicateSp'] = jest
        .fn()
        .mockReturnValueOnce('duplicate datapassId');
      service['buildExecutionReport'] = jest
        .fn()
        .mockReturnValueOnce(reportMock);

      const expected = [reportMock];

      // When
      const result = await service.validateAndCreateServiceProvider(
        serviceProviderMock,
        userMock,
      );

      // Then
      expect(result).toStrictEqual(expected);
    });

    it('should return error report if errors are found in the dto', async () => {
      // Given
      const reportMock = {
        client_id: '',
        client_secret: '',
        comments: 'scopes, redirect_uris',
        name: 'nameMock 1',
        status: Status.ERROR,
      };

      service['validateSpConfiguration'] = jest
        .fn()
        .mockResolvedValueOnce('scopes, redirect_uris');
      service['buildExecutionReport'] = jest
        .fn()
        .mockReturnValueOnce(reportMock);

      const expected = [reportMock];

      // When
      const result = await service.validateAndCreateServiceProvider(
        serviceProviderMock,
        userMock,
      );

      // Then
      expect(result).toStrictEqual(expected);
    });

    it('should return error report if service provider exists', async () => {
      // Given
      const reportMock = {
        client_id: '',
        client_secret: '',
        comments: 'some error message',
        name: 'nameMock 1',
        status: Status.ERROR,
      };

      service['validateIfSpAlreadyExists'] = jest
        .fn()
        .mockResolvedValueOnce('some error message');
      service['buildExecutionReport'] = jest
        .fn()
        .mockReturnValueOnce(reportMock);

      const expected = [reportMock];

      // When
      const result = await service.validateAndCreateServiceProvider(
        serviceProviderMock,
        userMock,
      );

      // Then
      expect(loggerServiceMock.info).toHaveBeenCalledTimes(0);
      expect(result).toStrictEqual(expected);
    });

    it('should return report with client_id and client_secret if service provider is created', async () => {
      // Given
      configDatabaseMock.findOneSpByQuery.mockResolvedValueOnce(null);
      const expected = [reporSuccesstMock];

      // When
      const result = await service.validateAndCreateServiceProvider(
        serviceProviderMock,
        userMock,
      );

      // Then
      expect(result).toStrictEqual(expected);
    });

    it('should call private method getCredentials', async () => {
      // When
      await service.validateAndCreateServiceProvider(
        serviceProviderMock,
        userMock,
      );

      // Then
      expect(service['getCredentials']).toHaveBeenCalledTimes(1);
    });

    it('should call private method buildServiceProviderPayload to build service provider', async () => {
      // When
      await service.validateAndCreateServiceProvider(
        serviceProviderMock,
        userMock,
      );

      // Then
      expect(service['buildServiceProviderPayload']).toHaveBeenCalledTimes(1);
      expect(service['buildServiceProviderPayload']).toHaveBeenCalledWith(
        serviceProviderMock[0],
        'client_id',
        'client_secret',
        'userMock',
      );
    });

    it('should call configDatabaseAdapter.create to save service provider', async () => {
      // When
      await service.validateAndCreateServiceProvider(
        serviceProviderMock,
        userMock,
      );

      // Then
      expect(configDatabaseMock.create).toHaveBeenCalledExactlyOnceWith({
        type: 'CONFIG_CREATE',
        payload: payloadMock,
      });
    });

    it('should return error report if an error occurs during process', async () => {
      // Given
      const reportMock = {
        client_id: '',
        client_secret: '',
        comments: 'Error during creation : Unknown Error',
        name: 'nameMock 1',
        status: Status.ERROR,
      };
      const errorMock = new Error('Unknown Error');
      configDatabaseMock.create.mockRejectedValueOnce(errorMock);
      service['buildExecutionReport'] = jest
        .fn()
        .mockReturnValueOnce(reportMock);

      const expected = [reportMock];

      // When
      const result = await service.validateAndCreateServiceProvider(
        serviceProviderMock,
        userMock,
      );

      // Then
      expect(loggerServiceMock.warning).toHaveBeenCalledExactlyOnceWith(
        errorMock,
      );
      expect(result).toStrictEqual(expected);
    });
  });

  describe('validateIfDuplicateSp', () => {
    it('should return error message for datapassId issues', () => {
      // Given
      const datapassIdCount = {
        '123': 2,
        '456': 1,
      };
      const entityIdCount = {
        entityId1: 1,
        entityId2: 1,
      };
      const sp = {
        datapassId: '123',
        entityId: 'entityId1',
      } as unknown as CsmrImportCoreServiceProviderInterface;

      // When
      const result = service['validateIfDuplicateSp'](
        datapassIdCount,
        entityIdCount,
        sp,
      );

      // Then
      expect(result).toBe('duplicate datapassId');
    });

    it('should return error message for entityId issues', () => {
      // Given
      const datapassIdCount = {
        '123': 1,
        '456': 1,
      };
      const entityIdCount = {
        entityId1: 2,
        entityId2: 1,
      };
      const sp = {
        datapassId: '123',
        entityId: 'entityId1',
      } as unknown as CsmrImportCoreServiceProviderInterface;

      // When
      const result = service['validateIfDuplicateSp'](
        datapassIdCount,
        entityIdCount,
        sp,
      );

      // Then
      expect(result).toBe('duplicate entityId');
    });

    it('should return error message combining datapassId and entityId issues', () => {
      // Given
      const datapassIdCount = {
        '123': 2,
        '456': 1,
      };
      const entityIdCount = {
        entityId1: 2,
        entityId2: 1,
      };
      const sp = {
        datapassId: '123',
        entityId: 'entityId1',
      } as unknown as CsmrImportCoreServiceProviderInterface;

      // When
      const result = service['validateIfDuplicateSp'](
        datapassIdCount,
        entityIdCount,
        sp,
      );

      // Then
      expect(result).toBe('duplicate datapassId and duplicate entityId');
    });

    it('should return undefined if no issues found', () => {
      // Given
      const datapassIdCount = {
        '123': 1,
        '456': 1,
      };
      const entityIdCount = {
        entityId1: 1,
        entityId2: 1,
      };
      const sp = {
        datapassId: '123',
        entityId: 'entityId1',
      } as unknown as CsmrImportCoreServiceProviderInterface;

      // When
      const result = service['validateIfDuplicateSp'](
        datapassIdCount,
        entityIdCount,
        sp,
      );

      // Then
      expect(result).toBe('');
    });
  });

  describe('validateIfSpAlreadyExists', () => {
    it('should call findOneSpByQuery to retrieve existing service provider', async () => {
      // Given
      configDatabaseMock.findOneSpByQuery.mockResolvedValueOnce(null);

      // When
      const result = await service['validateIfSpAlreadyExists'](
        serviceProviderMock[0],
      );

      // Then
      expect(configDatabaseMock.findOneSpByQuery).toHaveBeenCalledWith({
        platform: 'CORE_FCP',
        $or: [
          { signup_id: serviceProviderMock[0].datapassId },
          { entityId: serviceProviderMock[0].entityId },
        ],
      });
      expect(result).toStrictEqual('');
    });

    it('should return an error message if a service provider already exist', async () => {
      // Given
      configDatabaseMock.findOneSpByQuery.mockResolvedValueOnce({
        key: 'client_id_found',
      });

      // When
      const result = await service['validateIfSpAlreadyExists'](
        serviceProviderMock[0],
      );

      // Then
      expect(result).toBe(
        "Already present in the database (client_id 'client_id_found')",
      );
    });

    it('should return an error message if an error occurs', async () => {
      // Given
      const errorMock = new Error('Database Error');
      configDatabaseMock.findOneSpByQuery.mockRejectedValueOnce(errorMock);

      // When
      const result = await service['validateIfSpAlreadyExists'](
        serviceProviderMock[0],
      );

      // Then
      expect(result).toBe(
        'error during existence verification: Database Error',
      );
    });
  });

  describe('getCredentials', () => {
    beforeEach(() => {
      configServiceMock.get.mockReturnValueOnce({
        payloadEncoding: payloadEncodingMock,
      });
    });

    it('should call consumer hsm random method', async () => {
      // Given
      const expected = {
        type: 'CRYPTO_RANDOM',
        payload: {
          length: 64,
          encoding: payloadEncodingMock,
        },
      };

      // When
      await service['getCredentials']();

      // Then
      expect(csmrHsmClientMock.random).toHaveBeenCalledExactlyOnceWith(
        expected,
      );
    });

    it('should call splitInTwoParts with payload', async () => {
      // When
      await service['getCredentials']();

      // Then
      expect(splitInTwoPartsMock).toHaveBeenCalledExactlyOnceWith(payloadMock);
    });

    it('should return client_id and client_secret', async () => {
      // Given
      const expected = {
        client_id: 'client_id',
        client_secret: 'client_secret',
      };

      // When
      const result = await service['getCredentials']();

      // Then
      expect(result).toStrictEqual(expected);
    });
  });

  describe('buildServiceProviderPayload', () => {
    const client_id = 'client_id';
    const client_secret = 'client_secret';

    beforeEach(() => {
      service['normalizeScopes'] = jest
        .fn()
        .mockReturnValueOnce(['openid', 'profile']);

      configServiceMock.get.mockReturnValueOnce({
        rep_scope: [],
        idpFilterExclude: true,
        idpFilterList: [],
        active: true,
        claims: ['amr'],
        id_token_encrypted_response_alg: '',
        id_token_encrypted_response_enc: '',
        userinfo_encrypted_response_alg: '',
        userinfo_encrypted_response_enc: '',
        platform: 'CORE_FCP',
        eidas: 1,
      });
    });

    it('should return a private service provider formatted', () => {
      // Given
      const serviceProvider: CsmrImportCoreServiceProviderInterface = {
        name: 'nameMock',
        type: ClientTypeEnum.PRIVATE,
        email: ['test@email.com'],
        datapassId: '123',
        redirect_uris: ['https://example.com/callback'],
        post_logout_redirect_uris: ['https://example.com/logout'],
        scopes: ['openid', 'profile'],
        signedResponseAlg: SignatureAlgorithmEnum.RS256,
        phone: '123456789',
        site: ['https://example.com'],
        IPServerAddressesAndRanges: [],
        entityId: '',
      };
      const expected = {
        client_id,
        client_secret,
        name: serviceProvider.name,
        type: serviceProvider.type,
        emails: serviceProvider.email,
        signupId: serviceProvider.datapassId,
        IPServerAddressesAndRanges: serviceProvider.IPServerAddressesAndRanges,
        redirect_uris: serviceProvider.redirect_uris,
        post_logout_redirect_uris: serviceProvider.post_logout_redirect_uris,
        scope: ['openid', 'profile'],
        id_token_signed_response_alg: serviceProvider.signedResponseAlg,
        userinfo_signed_response_alg: serviceProvider.signedResponseAlg,
        site: serviceProvider.site,

        entityId: client_id,
        rep_scope: [],
        idpFilterExclude: true,
        idpFilterList: [],
        active: true,
        claims: ['amr'],
        identityConsent: true,
        id_token_encrypted_response_alg: '',
        id_token_encrypted_response_enc: '',
        userinfo_encrypted_response_alg: '',
        userinfo_encrypted_response_enc: '',
        platform: 'CORE_FCP',
        eidas: 1,

        createdBy: userMock,
        createdVia: CreatedVia.EXPLOITATION_BULK_FORM,
      };

      // When
      const result = service['buildServiceProviderPayload'](
        serviceProvider,
        client_id,
        client_secret,
        userMock,
      );

      // Then
      expect(result).toStrictEqual(expected);
    });

    it('should return a public service provider formatted', () => {
      // Given
      const serviceProvider: CsmrImportCoreServiceProviderInterface = {
        name: 'nameMock',
        type: ClientTypeEnum.PUBLIC,
        email: ['test@email.com'],
        datapassId: '123',
        redirect_uris: ['https://example.com/callback'],
        post_logout_redirect_uris: ['https://example.com/logout'],
        scopes: ['openid', 'profile'],
        signedResponseAlg: SignatureAlgorithmEnum.RS256,
        phone: '123456789',
        site: ['https://example.com'],
        IPServerAddressesAndRanges: [],
        entityId: '',
      };
      const expected = {
        client_id,
        client_secret,
        name: serviceProvider.name,
        type: serviceProvider.type,
        emails: serviceProvider.email,
        signupId: serviceProvider.datapassId,
        IPServerAddressesAndRanges: serviceProvider.IPServerAddressesAndRanges,
        redirect_uris: serviceProvider.redirect_uris,
        post_logout_redirect_uris: serviceProvider.post_logout_redirect_uris,
        scope: ['openid', 'profile'],
        id_token_signed_response_alg: serviceProvider.signedResponseAlg,
        userinfo_signed_response_alg: serviceProvider.signedResponseAlg,
        site: serviceProvider.site,

        entityId: client_id,
        rep_scope: [],
        idpFilterExclude: true,
        idpFilterList: [],
        active: true,
        claims: ['amr'],
        identityConsent: false,
        id_token_encrypted_response_alg: '',
        id_token_encrypted_response_enc: '',
        userinfo_encrypted_response_alg: '',
        userinfo_encrypted_response_enc: '',
        platform: 'CORE_FCP',
        eidas: 1,

        createdBy: userMock,
        createdVia: CreatedVia.EXPLOITATION_BULK_FORM,
      };

      // When
      const result = service['buildServiceProviderPayload'](
        serviceProvider,
        client_id,
        client_secret,
        userMock,
      );

      // Then
      expect(result).toStrictEqual(expected);
    });

    it('should return a public service provider formatted with enityId equal to client_id_v1', () => {
      // Given
      const serviceProvider: CsmrImportCoreServiceProviderInterface = {
        name: 'nameMock',
        type: ClientTypeEnum.PUBLIC,
        email: ['test@email.com'],
        datapassId: '123',
        redirect_uris: ['https://example.com/callback'],
        post_logout_redirect_uris: ['https://example.com/logout'],
        scopes: ['openid', 'profile'],
        signedResponseAlg: SignatureAlgorithmEnum.RS256,
        phone: '123456789',
        entityId: 'client_id_v1',
        site: ['https://example.com'],
        IPServerAddressesAndRanges: [],
      };
      const expected = {
        client_id,
        client_secret,
        name: serviceProvider.name,
        type: serviceProvider.type,
        emails: serviceProvider.email,
        signupId: serviceProvider.datapassId,
        IPServerAddressesAndRanges: serviceProvider.IPServerAddressesAndRanges,
        redirect_uris: serviceProvider.redirect_uris,
        post_logout_redirect_uris: serviceProvider.post_logout_redirect_uris,
        scope: ['openid', 'profile'],
        id_token_signed_response_alg: serviceProvider.signedResponseAlg,
        userinfo_signed_response_alg: serviceProvider.signedResponseAlg,
        site: serviceProvider.site,

        entityId: serviceProvider.entityId,
        rep_scope: [],
        idpFilterExclude: true,
        idpFilterList: [],
        active: true,
        claims: ['amr'],
        identityConsent: false,
        id_token_encrypted_response_alg: '',
        id_token_encrypted_response_enc: '',
        userinfo_encrypted_response_alg: '',
        userinfo_encrypted_response_enc: '',
        platform: 'CORE_FCP',
        eidas: 1,

        createdBy: userMock,
        createdVia: CreatedVia.EXPLOITATION_BULK_FORM,
      };

      // When
      const result = service['buildServiceProviderPayload'](
        serviceProvider,
        client_id,
        client_secret,
        userMock,
      );

      // Then
      expect(result).toStrictEqual(expected);
    });

    it('should add openid scope if not present', () => {
      // Given
      const serviceProvider: CsmrImportCoreServiceProviderInterface = {
        name: 'nameMock',
        type: ClientTypeEnum.PUBLIC,
        email: ['test@email.com'],
        datapassId: '123',
        redirect_uris: ['https://example.com/callback'],
        post_logout_redirect_uris: ['https://example.com/logout'],
        scopes: ['profile'],
        signedResponseAlg: SignatureAlgorithmEnum.RS256,
        phone: '123456789',
        entityId: 'client_id_v1',
        site: ['https://example.com'],
        IPServerAddressesAndRanges: [],
      };
      const expected = {
        client_id,
        client_secret,
        name: serviceProvider.name,
        type: serviceProvider.type,
        emails: serviceProvider.email,
        signupId: serviceProvider.datapassId,
        IPServerAddressesAndRanges: serviceProvider.IPServerAddressesAndRanges,
        redirect_uris: serviceProvider.redirect_uris,
        post_logout_redirect_uris: serviceProvider.post_logout_redirect_uris,
        scope: ['openid', 'profile'],
        id_token_signed_response_alg: serviceProvider.signedResponseAlg,
        userinfo_signed_response_alg: serviceProvider.signedResponseAlg,
        site: serviceProvider.site,

        entityId: serviceProvider.entityId,
        rep_scope: [],
        idpFilterExclude: true,
        idpFilterList: [],
        active: true,
        claims: ['amr'],
        identityConsent: false,
        id_token_encrypted_response_alg: '',
        id_token_encrypted_response_enc: '',
        userinfo_encrypted_response_alg: '',
        userinfo_encrypted_response_enc: '',
        platform: 'CORE_FCP',
        eidas: 1,

        createdBy: userMock,
        createdVia: CreatedVia.EXPLOITATION_BULK_FORM,
      };

      // When
      const result = service['buildServiceProviderPayload'](
        serviceProvider,
        client_id,
        client_secret,
        userMock,
      );

      // Then
      expect(result).toStrictEqual(expected);
    });
  });

  describe('buildExecutionReport', () => {
    const commentsMock = 'some comments';

    it('should return a report object with the correct properties', () => {
      // Given
      const clientIdMock = 'client_id';
      const clientSecretMock = 'client_secret';

      // When
      const result = service['buildExecutionReport'](
        serviceProviderMock[0],
        Status.SUCCESS,
        commentsMock,
        clientIdMock,
        clientSecretMock,
      );

      // Then
      expect(result).toStrictEqual({
        ...serviceProviderMock[0],
        status: Status.SUCCESS,
        comments: commentsMock,
        client_id: clientIdMock,
        client_secret: clientSecretMock,
      });
    });

    it('should return a report object with client_id / client_secret with default value', () => {
      // When
      const result = service['buildExecutionReport'](
        serviceProviderMock[0],
        Status.SUCCESS,
        commentsMock,
      );

      // Then
      expect(result).toStrictEqual({
        ...serviceProviderMock[0],
        status: Status.SUCCESS,
        comments: commentsMock,
        client_id: '',
        client_secret: '',
      });
    });
  });

  describe('validateSpConfiguration', () => {
    it('should call validateDto method', async () => {
      // When
      await service['validateSpConfiguration'](serviceProviderMock[0]);

      // Then
      expect(validateDtoMock).toHaveBeenCalledExactlyOnceWith(
        serviceProviderMock[0],
        CsmrImportCoreServiceProviderDto,
        {
          forbidNonWhitelisted: true,
          forbidUnknownValues: true,
          whitelist: true,
        },
      );
    });

    it('should return true if the dto is valid', async () => {
      // When
      const result = await service['validateSpConfiguration'](
        serviceProviderMock[0],
      );

      // Then
      expect(loggerServiceMock.debug).toHaveBeenCalledExactlyOnceWith({
        errors: validateDtoErrorMock,
      });
      expect(result).toBe('invalid param');
    });
  });

  describe('normalizeScopes', () => {
    beforeEach(() => {
      scopesServiceMock.getRawClaimsFromScopes.mockReturnValueOnce([
        'sub',
        'birthcountry',
        'birthplace',
      ]);
      scopesServiceMock.getScopesFromClaims.mockReturnValueOnce([
        'openid',
        'birth',
      ]);
    });

    it('should add openid scope if not present', () => {
      // Given
      const scopes = ['birthcountry', 'birthplace'];

      // When
      const result = service['normalizeScopes'](scopes);

      // Then
      expect(result).toStrictEqual(['openid', 'birth']);
    });

    it('should call getRawClaimsFromScopes method with no duplicate scopes', () => {
      // Given
      const scopes = ['birthcountry', 'birthplace', 'birthcountry'];
      // When
      service['normalizeScopes'](scopes);

      // Then
      expect(
        scopesServiceMock.getRawClaimsFromScopes,
      ).toHaveBeenCalledExactlyOnceWith([
        'openid',
        'birthcountry',
        'birthplace',
      ]);
    });

    it('should call getScopesFromClaims method', () => {
      // Given
      const scopes = ['birthcountry', 'birthplace'];

      // When
      service['normalizeScopes'](scopes);

      // Then
      expect(
        scopesServiceMock.getScopesFromClaims,
      ).toHaveBeenCalledExactlyOnceWith(['sub', 'birthcountry', 'birthplace']);
    });

    it('should return normalized scopes', () => {
      // Given
      const scopes = ['birthcountry', 'birthplace'];

      // When
      const result = service['normalizeScopes'](scopes);

      // Then
      expect(result).toStrictEqual(['openid', 'birth']);
    });
  });
});

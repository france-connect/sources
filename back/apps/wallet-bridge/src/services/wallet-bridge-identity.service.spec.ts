import { KoaContextWithOIDC } from 'oidc-provider';
import { v4 as uuid } from 'uuid';

import { Test, TestingModule } from '@nestjs/testing';

import { AssetsService } from '@fc/app';
import { nowInSeconds } from '@fc/common';
import { ConfigService } from '@fc/config';
import { EudiDocTypes, EudiGenders, EudiPidClaimsDto } from '@fc/eudi';
import { EudiCogService } from '@fc/eudi-cog';
import { LoggerService } from '@fc/logger';
import {
  OidcProviderErrorService,
  OidcProviderGrantService,
  OidcProviderRuntimeException,
} from '@fc/oidc-provider';
import { Openid4vpInteractionDto, Openid4vpService } from '@fc/openid4vp';
import { SessionService } from '@fc/session';

import { getLoggerMock } from '@mocks/logger';
import { getSessionServiceMock } from '@mocks/session';

import {
  WalletBridgeMultipleDocumentsFoundException,
  WalletBridgeNoDocumentFoundException,
} from '../exceptions';
import { WalletBridgeIdentityService } from './wallet-bridge-identity.service';

jest.mock('@fc/common', () => ({
  ...(jest.requireActual('@fc/common') as object),
  nowInSeconds: jest.fn(),
}));

jest.mock('uuid');

describe('WalletBridgeIdentityService', () => {
  const uuidMock = jest.mocked(uuid);

  const openid4vpIdentityMock = {
    given_name: 'Angela Claire Louise',
    family_name: 'DUBOIS',
    birth_place: 'Paris',
    birth_country: 'FR',
    birth_date: '1962-08-24',
    sex: 2,
    email_address: 'wossewodda-3728@yopmail.com',
  };

  const oidcIdentityMock = {
    given_name: 'Angela Claire Louise',
    family_name: 'DUBOIS',
    birthdate: '1962-08-24',
    gender: 'female',
    email: 'wossewodda-3728@yopmail.com',
    birthplace: '75007',
    birthcountry: '99100',
  };

  const nowInSecondsMock = jest.mocked(nowInSeconds);
  const nowMock = 1234567890;

  const loggerMock = getLoggerMock();
  const sessionServiceMock = getSessionServiceMock();

  const errorServiceMock = {
    throwError: jest.fn(),
  };

  const grantServiceMock = {
    generateGrant: jest.fn(),
    saveGrant: jest.fn(),
  };

  const configServiceMock = {
    get: jest.fn(),
  };

  const assetsServiceMock = {
    getAssetFullPath: jest.fn(),
  };

  const openid4vpServiceMock = {
    bindInteractionToBackendId: jest.fn(),
    unbindInteractionFromBackendId: jest.fn(),
    getInteractionByBackendId: jest.fn(),
  };

  const providerMock = {
    interactionFinished: jest.fn(),
  };

  const interactionMock = {
    id: 'interactionIdMock',
    presentationId: 'presentationIdMock',
    state: 'stateMock',
    nonce: 'nonceMock',
    iat: 1700000000,
    exp: 1700000600,
  } as unknown as Openid4vpInteractionDto;
  const backendSessionIdMock = 'session-id-mock';

  const eudiCogServiceMock = {
    resolveCog: jest.fn(),
  };

  const reqMock = {} as any;
  const resMock = {} as any;
  let service: WalletBridgeIdentityService;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    nowInSecondsMock.mockReturnValue(nowMock);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletBridgeIdentityService,
        LoggerService,
        SessionService,
        OidcProviderErrorService,
        OidcProviderGrantService,
        ConfigService,
        AssetsService,
        Openid4vpService,
        EudiCogService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .overrideProvider(OidcProviderErrorService)
      .useValue(errorServiceMock)
      .overrideProvider(OidcProviderGrantService)
      .useValue(grantServiceMock)
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(AssetsService)
      .useValue(assetsServiceMock)
      .overrideProvider(Openid4vpService)
      .useValue(openid4vpServiceMock)
      .overrideProvider(EudiCogService)
      .useValue(eudiCogServiceMock)
      .compile();

    service = module.get<WalletBridgeIdentityService>(
      WalletBridgeIdentityService,
    );
    service['provider'] = providerMock as any;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAccount()', () => {
    const ctxMock = {} as KoaContextWithOIDC;
    const subMock = 'sub-mock';

    beforeEach(() => {
      openid4vpServiceMock.getInteractionByBackendId.mockResolvedValue(
        interactionMock,
      );
      service['extractIdentity'] = jest
        .fn()
        .mockReturnValue(openid4vpIdentityMock);
      service['convertPidToOidc'] = jest.fn().mockReturnValue(oidcIdentityMock);
      service['computeSub'] = jest.fn().mockReturnValue(subMock);
    });

    it('should fetch the interaction with the backend session id', async () => {
      // When
      await service.findAccount(ctxMock, backendSessionIdMock);

      // Then
      expect(
        openid4vpServiceMock.getInteractionByBackendId,
      ).toHaveBeenCalledExactlyOnceWith(backendSessionIdMock);
    });

    it('should extract the identity from the interaction', async () => {
      // When
      await service.findAccount(ctxMock, backendSessionIdMock);

      // Then
      expect(service['extractIdentity']).toHaveBeenCalledExactlyOnceWith(
        interactionMock,
      );
    });

    it('should convert the PID identity for OIDC', async () => {
      // When
      await service.findAccount(ctxMock, backendSessionIdMock);

      // Then
      expect(service['convertPidToOidc']).toHaveBeenCalledExactlyOnceWith(
        openid4vpIdentityMock,
      );
    });

    it('should return the account id and the claims function', async () => {
      // When
      const result = await service.findAccount(ctxMock, backendSessionIdMock);

      // Then
      expect(result).toEqual({
        accountId: subMock,
        claims: expect.any(Function),
      });
    });

    it('should return a claims function that returns the OIDC identity', async () => {
      // When
      const result = await service.findAccount(ctxMock, backendSessionIdMock);

      // Then
      expect(await result.claims()).toEqual({
        sub: subMock,
        ...oidcIdentityMock,
      });
    });
  });

  describe('finishInteraction()', () => {
    const grantMock = Symbol('grant');
    const grantIdMock = 'grant-id-mock';

    beforeEach(() => {
      grantServiceMock.generateGrant.mockResolvedValue(grantMock);
      grantServiceMock.saveGrant.mockResolvedValue(grantIdMock);
      uuidMock.mockReturnValue(
        backendSessionIdMock as unknown as Uint8Array<ArrayBufferLike>,
      );
    });

    it('should call grantService.generateGrant with provider, req, res and static sub', async () => {
      // When
      await service.finishInteraction(reqMock, resMock, interactionMock);

      // Then
      expect(grantServiceMock.generateGrant).toHaveBeenCalledWith(
        providerMock,
        reqMock,
        resMock,
        backendSessionIdMock,
      );
    });

    it('should call grantService.saveGrant with the generated grant', async () => {
      // When
      await service.finishInteraction(reqMock, resMock, interactionMock);

      // Then
      expect(grantServiceMock.saveGrant).toHaveBeenCalledExactlyOnceWith(
        grantMock,
      );
    });

    it('should call provider.interactionFinished with the correct result', async () => {
      // When
      await service.finishInteraction(reqMock, resMock, interactionMock);

      // Then
      expect(providerMock.interactionFinished).toHaveBeenCalledExactlyOnceWith(
        reqMock,
        resMock,
        {
          login: {
            acr: 'eidas3',
            accountId: backendSessionIdMock,
            ts: nowMock,
            remember: false,
          },
          consent: {
            grantId: grantIdMock,
          },
        },
      );
    });

    it('should use nowInSeconds for the ts field in the login result', async () => {
      // When
      await service.finishInteraction(reqMock, resMock, interactionMock);

      // Then
      expect(nowInSecondsMock).toHaveBeenCalledTimes(1);
    });

    it('should throw OidcProviderRuntimeException when provider.interactionFinished rejects', async () => {
      // Given
      const errorMock = new Error('interaction error');
      providerMock.interactionFinished.mockRejectedValueOnce(errorMock);

      // Then
      await expect(
        service.finishInteraction(reqMock, resMock, interactionMock),
      ).rejects.toThrow(OidcProviderRuntimeException);
    });

    it('should unbind the interaction from the backend id', async () => {
      // Given
      const errorMock = new Error('interaction error');
      providerMock.interactionFinished.mockRejectedValueOnce(errorMock);

      // When
      try {
        await service.finishInteraction(reqMock, resMock, interactionMock);
      } catch {}

      // Then
      expect(
        openid4vpServiceMock.unbindInteractionFromBackendId,
      ).toHaveBeenCalledExactlyOnceWith(backendSessionIdMock);
    });

    it('should use the static identity regardless of the session content', async () => {
      // Given
      const sessionWithData = {
        spId: 'some-sp',
        interactionId: 'some-interaction',
      } as unknown as Openid4vpInteractionDto;

      // When
      await service.finishInteraction(reqMock, resMock, sessionWithData);

      // Then
      expect(grantServiceMock.generateGrant).toHaveBeenCalledWith(
        providerMock,
        reqMock,
        resMock,
        backendSessionIdMock,
      );
    });
  });

  describe('extractIdentity()', () => {
    it('should extract and unwrap the PID from the interaction claims', () => {
      // Given
      const interactionMock = {
        response: [
          {
            claims: {
              [EudiDocTypes.PID]: openid4vpIdentityMock,
            },
          },
        ],
      } as unknown as Openid4vpInteractionDto;

      // When
      const result = service['extractIdentity'](interactionMock);

      // Then
      expect(result).toEqual(openid4vpIdentityMock);
    });

    it('should throw WalletBridgeNoDocumentFoundException when the response is empty', () => {
      // Given
      const interactionMock = {
        response: [],
      } as unknown as Openid4vpInteractionDto;

      // When / Then
      expect(() => service['extractIdentity'](interactionMock)).toThrow(
        WalletBridgeNoDocumentFoundException,
      );
    });

    it('should throw WalletBridgeMultipleDocumentsFoundException when the response contains more than one document', () => {
      // Given
      const interactionMock = {
        response: [
          { claims: openid4vpIdentityMock },
          { claims: openid4vpIdentityMock },
        ],
      } as unknown as Openid4vpInteractionDto;

      // When / Then
      expect(() => service['extractIdentity'](interactionMock)).toThrow(
        WalletBridgeMultipleDocumentsFoundException,
      );
    });
  });

  describe('computeSub()', () => {
    it('should return the backend session id', () => {
      // When
      const result = service['computeSub'](
        backendSessionIdMock,
        oidcIdentityMock,
      );

      // Then
      expect(result).toEqual(backendSessionIdMock);
    });
  });

  describe('convertPidToOidc()', () => {
    beforeEach(() => {
      eudiCogServiceMock.resolveCog.mockReturnValue({
        birthplace: '75007',
        birthcountry: '99100',
      });
    });

    it('should convert the PID claims to an OIDC identity', () => {
      // When
      const result = service['convertPidToOidc'](
        openid4vpIdentityMock as unknown as EudiPidClaimsDto,
      );

      // Then
      expect(result).toEqual(oidcIdentityMock);
    });

    it('should resolve the cog using the EudiCogService', () => {
      // When
      service['convertPidToOidc'](
        openid4vpIdentityMock as unknown as EudiPidClaimsDto,
      );

      // Then
      expect(eudiCogServiceMock.resolveCog).toHaveBeenCalledExactlyOnceWith(
        openid4vpIdentityMock.birth_place,
      );
    });
  });

  describe('mapGender()', () => {
    const cases = [
      ['unspecified', EudiGenders.NOT_KNOWN],
      ['male', EudiGenders.MALE],
      ['female', EudiGenders.FEMALE],
      ['unspecified', EudiGenders.OTHER],
      ['unspecified', EudiGenders.INTER],
      ['unspecified', EudiGenders.DIVERSE],
      ['unspecified', EudiGenders.OPEN],
      ['unspecified', EudiGenders.NOT_APPLICABLE],
      ['unspecified', undefined],
    ];

    it.each(cases)(`should return %s for %s`, (output, input) => {
      // When
      const result = service['mapGender'](input as EudiGenders);

      // Then
      expect(result).toEqual(output);
    });
  });
});

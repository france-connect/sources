import { KoaContextWithOIDC } from 'oidc-provider';

import { Test, TestingModule } from '@nestjs/testing';

import { AssetsService } from '@fc/app';
import { nowInSeconds } from '@fc/common';
import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';
import { OidcSession } from '@fc/oidc';
import {
  OidcProviderErrorService,
  OidcProviderGrantService,
  OidcProviderRuntimeException,
} from '@fc/oidc-provider';
import { SessionService } from '@fc/session';

import { getLoggerMock } from '@mocks/logger';
import { getSessionServiceMock } from '@mocks/session';

import { WalletBridgeIdentityService } from './wallet-bridge-identity.service';

jest.mock('@fc/common', () => ({
  ...(jest.requireActual('@fc/common') as object),
  nowInSeconds: jest.fn(),
}));

const TEST_IDENTITY = {
  sub: '17ea2fcfdffc94b43ae8abdf399a4e1fe05a9869b8b197ce451c9a1ac6210584v1',
  given_name: 'Angela Claire Louise',
  family_name: 'DUBOIS',
  birthdate: '1962-08-24',
  gender: 'female',
  email: 'wossewodda-3728@yopmail.com',
  birthplace: '75107',
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

const providerMock = {
  interactionFinished: jest.fn(),
};

const reqMock = {} as any;
const resMock = {} as any;

describe('WalletBridgeIdentityService', () => {
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
    const sessionIdMock = 'session-id-mock';

    it('should return an object with the static accountId', async () => {
      // When
      const result = await service.findAccount(ctxMock, sessionIdMock);

      // Then
      expect(result.accountId).toBe(TEST_IDENTITY.sub);
    });

    it('should return claims resolving to the full static identity', async () => {
      // When
      const account = await service.findAccount(ctxMock, sessionIdMock);
      const claims = await account.claims();

      // Then
      expect(claims).toStrictEqual(TEST_IDENTITY);
    });

    it('should always return the static accountId regardless of the provided sessionId', async () => {
      // Given
      const differentSessionId = 'completely-different-id';

      // When
      const result = await service.findAccount(ctxMock, differentSessionId);

      // Then
      expect(result.accountId).toBe(TEST_IDENTITY.sub);
    });
  });

  describe('finishInteraction()', () => {
    const grantMock = Symbol('grant');
    const grantIdMock = 'grant-id-mock';

    beforeEach(() => {
      grantServiceMock.generateGrant.mockResolvedValue(grantMock);
      grantServiceMock.saveGrant.mockResolvedValue(grantIdMock);
    });

    it('should call grantService.generateGrant with provider, req, res and static sub', async () => {
      // When
      await service.finishInteraction(reqMock, resMock, {} as OidcSession);

      // Then
      expect(grantServiceMock.generateGrant).toHaveBeenCalledExactlyOnceWith(
        providerMock,
        reqMock,
        resMock,
        TEST_IDENTITY.sub,
      );
    });

    it('should call grantService.saveGrant with the generated grant', async () => {
      // When
      await service.finishInteraction(reqMock, resMock, {} as OidcSession);

      // Then
      expect(grantServiceMock.saveGrant).toHaveBeenCalledExactlyOnceWith(
        grantMock,
      );
    });

    it('should call provider.interactionFinished with the correct result', async () => {
      // When
      await service.finishInteraction(reqMock, resMock, {} as OidcSession);

      // Then
      expect(providerMock.interactionFinished).toHaveBeenCalledExactlyOnceWith(
        reqMock,
        resMock,
        {
          login: {
            acr: 'eidas3',
            accountId: TEST_IDENTITY.sub,
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
      await service.finishInteraction(reqMock, resMock, {} as OidcSession);

      // Then
      expect(nowInSecondsMock).toHaveBeenCalledTimes(1);
    });

    it('should throw OidcProviderRuntimeException when provider.interactionFinished rejects', async () => {
      // Given
      const errorMock = new Error('interaction error');
      providerMock.interactionFinished.mockRejectedValueOnce(errorMock);

      // Then
      await expect(
        service.finishInteraction(reqMock, resMock, {} as OidcSession),
      ).rejects.toThrow(OidcProviderRuntimeException);
    });

    it('should use the static identity regardless of the session content', async () => {
      // Given
      const sessionWithData = {
        spId: 'some-sp',
        interactionId: 'some-interaction',
      } as unknown as OidcSession;

      // When
      await service.finishInteraction(reqMock, resMock, sessionWithData);

      // Then
      expect(grantServiceMock.generateGrant).toHaveBeenCalledWith(
        providerMock,
        reqMock,
        resMock,
        TEST_IDENTITY.sub,
      );
    });
  });
});

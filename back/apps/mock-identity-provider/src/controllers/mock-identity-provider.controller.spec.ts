import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger';
import { OidcClientService } from '@fc/oidc-client';
import { OidcProviderService } from '@fc/oidc-provider';
import { SessionService } from '@fc/session';

import { MockIdentityProviderService } from '../services';
import { MockIdentityProviderController } from './mock-identity-provider.controller';

describe('MockIdentityProviderFcaController', () => {
  let controller: MockIdentityProviderController;

  const req = {
    fc: {
      interactionId: 'interactionIdMockValue',
    },
  };
  const res = {
    redirect: jest.fn(),
  };

  const next = jest.fn();

  const oidcClientServiceMock = {
    getAuthorizeUrl: jest.fn(),
    getTokenSet: jest.fn(),
    getUserInfo: jest.fn(),
    wellKnownKeys: jest.fn(),
    buildAuthorizeParameters: jest.fn(),
    finishInteraction: jest.fn(),
  };

  const loggerServiceMock = {
    setContext: jest.fn(),
    trace: jest.fn(),
  } as unknown as LoggerService;

  const oidcClientSessionServiceMock = {
    set: jest.fn(),
    get: jest.fn(),
    getId: jest.fn(),
    setAlias: jest.fn(),
  };

  const oidcProviderServiceMock = {
    getInteraction: jest.fn(),
    finishInteraction: jest.fn(),
  };

  const mockIdentityProviderFcaServiceMock = {
    getIdentity: jest.fn(),
  };

  const interactionIdMock = 'interactionIdMockValue';
  const acrMock = 'eidas2';
  const scopeMock = 'scopeMock';
  const providerUidMock = 'providerUidMock';
  const loginMockValue = 'loginMockValue';
  const randomStringMock = 'randomStringMockValue';
  const stateMock = randomStringMock;
  const sessionIdMock = randomStringMock;

  const interactionMock = {
    uid: 'uidMockValue',
    params: 'paramsMockValue',
  };

  const spNameMock = Symbol('spNameMockValue');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MockIdentityProviderController],
      providers: [
        OidcClientService,
        LoggerService,
        SessionService,
        OidcProviderService,
        MockIdentityProviderService,
      ],
    })
      .overrideProvider(OidcClientService)
      .useValue(oidcClientServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(SessionService)
      .useValue(oidcClientSessionServiceMock)
      .overrideProvider(OidcProviderService)
      .useValue(oidcProviderServiceMock)
      .overrideProvider(MockIdentityProviderService)
      .useValue(mockIdentityProviderFcaServiceMock)
      .compile();

    controller = module.get<MockIdentityProviderController>(
      MockIdentityProviderController,
    );

    jest.resetAllMocks();

    oidcClientServiceMock.buildAuthorizeParameters.mockReturnValue({
      state: stateMock,
      scope: scopeMock,
      providerUid: providerUidMock,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: acrMock,
    });

    oidcProviderServiceMock.getInteraction.mockResolvedValue(interactionMock);
    oidcClientSessionServiceMock.get.mockResolvedValue(spNameMock);

    oidcClientSessionServiceMock.getId.mockReturnValue(sessionIdMock);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('index', () => {
    it('Should return some status object', async () => {
      // setup
      oidcClientSessionServiceMock.set.mockResolvedValueOnce(undefined);
      // action
      const result = await controller.index();
      // assert
      expect(result).toEqual({ status: 'ok' });
    });
  });

  describe('getInteraction', () => {
    const appSessionServiceMock = {
      get: jest.fn(),
      set: jest.fn(),
    };
    const finalSpIdMock = 'abcdefghijklmnopqrstuvwxyz0123456789';

    beforeEach(() => {
      appSessionServiceMock.get.mockResolvedValueOnce(finalSpIdMock);
    });

    it('should call oidcProvider.getInteraction', async () => {
      // When
      await controller.getInteraction(
        req,
        res,
        oidcClientSessionServiceMock,
        appSessionServiceMock,
      );
      // Then
      expect(oidcProviderServiceMock.getInteraction).toBeCalledTimes(1);
      expect(oidcProviderServiceMock.getInteraction).toBeCalledWith(req, res);
    });

    it('should call oidcClientSessionServiceMock.get with spName', async () => {
      // When
      await controller.getInteraction(
        req,
        res,
        oidcClientSessionServiceMock,
        appSessionServiceMock,
      );
      // Then
      expect(oidcClientSessionServiceMock.get).toBeCalledTimes(1);
      expect(oidcClientSessionServiceMock.get).toBeCalledWith('spName');
    });

    it('should call appSessionServiceMock.get with finalspId', async () => {
      // When
      await controller.getInteraction(
        req,
        res,
        oidcClientSessionServiceMock,
        appSessionServiceMock,
      );
      // Then
      expect(appSessionServiceMock.get).toBeCalledTimes(1);
      expect(appSessionServiceMock.get).toBeCalledWith('finalSpId');
    });

    it('should return an object with data from session and oidcProvider interaction', async () => {
      // When
      const result = await controller.getInteraction(
        req,
        res,
        oidcClientSessionServiceMock,
        appSessionServiceMock,
      );
      // Then
      expect(result).toEqual({
        uid: interactionMock.uid,
        params: interactionMock.params,
        spName: spNameMock,
        finalSpId: finalSpIdMock,
      });
    });
  });

  describe('getLogin', () => {
    const interactionId: string = interactionIdMock;
    const body = {
      login: loginMockValue,
      interactionId,
      acr: acrMock,
    };

    it('should call service.getIdentity()', async () => {
      // Given
      const identityMock = {};
      mockIdentityProviderFcaServiceMock.getIdentity.mockResolvedValue(
        identityMock,
      );
      // When
      await controller.getLogin(next, req, body, oidcClientSessionServiceMock);
      // Then

      expect(
        mockIdentityProviderFcaServiceMock.getIdentity,
      ).toHaveBeenCalledTimes(1);
      expect(
        mockIdentityProviderFcaServiceMock.getIdentity,
      ).toHaveBeenCalledWith(body.login);
    });

    it('should store identity and acr in session', async () => {
      // Given
      const identityMock = {};
      mockIdentityProviderFcaServiceMock.getIdentity.mockResolvedValue(
        identityMock,
      );
      // When
      await controller.getLogin(next, req, body, oidcClientSessionServiceMock);
      // Then
      expect(oidcClientSessionServiceMock.set).toHaveBeenCalledTimes(1);
      expect(oidcClientSessionServiceMock.set).toHaveBeenCalledWith({
        spIdentity: identityMock,
        spAcr: acrMock,
      });
    });

    it('should call next if the identity is found', async () => {
      // Given
      const accountMock = {};
      mockIdentityProviderFcaServiceMock.getIdentity.mockResolvedValue(
        accountMock,
      );
      const interactionId: string = interactionIdMock;
      const body = {
        interactionId,
        login: loginMockValue,
        acr: acrMock,
      };
      // When
      await controller.getLogin(next, req, body, oidcClientSessionServiceMock);
      // Then
      expect(next).toHaveBeenCalledTimes(1);
    });
  });

  it('should throw an error and not call "next" if the identity is not found', async () => {
    // Given
    mockIdentityProviderFcaServiceMock.getIdentity.mockResolvedValue(undefined);
    const interactionId: string = interactionIdMock;
    const body = {
      interactionId,
      login: loginMockValue,
      acr: acrMock,
    };
    const expectedError = new Error('Identity not found in database');

    // When / Then
    await expect(() =>
      controller.getLogin(next, req, body, oidcClientSessionServiceMock),
    ).rejects.toThrow(expectedError);
    expect(next).toHaveBeenCalledTimes(0);
  });
});

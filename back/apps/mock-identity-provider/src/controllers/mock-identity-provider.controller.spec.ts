import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger-legacy';
import { OidcProviderService } from '@fc/oidc-provider';

import { MockIdentityProviderService } from '../services';
import { MockIdentityProviderController } from './mock-identity-provider.controller';

describe('MockIdentityProviderController', () => {
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
  };

  const appSessionServiceMock = {
    set: jest.fn(),
    get: jest.fn(),
  };

  const oidcProviderServiceMock = {
    getInteraction: jest.fn(),
    finishInteraction: jest.fn(),
  };

  const mockIdentityProviderServiceMock = {
    getIdentity: jest.fn(),
  };

  const interactionIdMock = 'interactionIdMockValue';
  const acrMock = 'eidas2';
  const scopeMock = 'scopeMock';
  const providerUidMock = 'providerUidMock';
  const loginMockValue = 'loginMockValue';
  const randomStringMock = 'randomStringMockValue';
  const stateMock = randomStringMock;

  const interactionMock = {
    uid: 'uidMockValue',
    params: 'paramsMockValue',
  };

  const spNameMock = Symbol('spNameMockValue');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MockIdentityProviderController],
      providers: [
        LoggerService,
        OidcProviderService,
        MockIdentityProviderService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(OidcProviderService)
      .useValue(oidcProviderServiceMock)
      .overrideProvider(MockIdentityProviderService)
      .useValue(mockIdentityProviderServiceMock)
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

    it('should call service.getIdentity() to retrieve sp identity', async () => {
      // Given
      const identityMock = {};
      mockIdentityProviderServiceMock.getIdentity.mockResolvedValue(
        identityMock,
      );
      // When
      await controller.getLogin(
        next,
        body,
        oidcClientSessionServiceMock,
        appSessionServiceMock,
      );
      // Then
      expect(mockIdentityProviderServiceMock.getIdentity).toHaveBeenCalledTimes(
        1,
      );
      expect(mockIdentityProviderServiceMock.getIdentity).toHaveBeenCalledWith(
        body.login,
      );
    });

    it('should throw an error and not call "next" if the identity is not found', async () => {
      // Given
      mockIdentityProviderServiceMock.getIdentity.mockResolvedValue(undefined);
      const interactionId: string = interactionIdMock;
      const body = {
        interactionId,
        login: loginMockValue,
        acr: acrMock,
      };
      const expectedError = new Error('Identity not found in database');

      // When / Then
      await expect(() =>
        controller.getLogin(
          next,
          body,
          oidcClientSessionServiceMock,
          appSessionServiceMock,
        ),
      ).rejects.toThrow(expectedError);
      expect(next).toHaveBeenCalledTimes(0);
    });

    it('should save the login in app session', async () => {
      // Given
      const identityMock = {};
      mockIdentityProviderServiceMock.getIdentity.mockResolvedValue(
        identityMock,
      );
      // When
      await controller.getLogin(
        next,
        body,
        oidcClientSessionServiceMock,
        appSessionServiceMock,
      );
      // Then
      expect(appSessionServiceMock.set).toHaveBeenCalledTimes(1);
      expect(appSessionServiceMock.set).toHaveBeenCalledWith(
        'userLogin',
        body.login,
      );
    });

    it('should get the spId from oidcSession', async () => {
      // Given
      const identityMock = {};
      mockIdentityProviderServiceMock.getIdentity.mockResolvedValue(
        identityMock,
      );
      // When
      await controller.getLogin(
        next,
        body,
        oidcClientSessionServiceMock,
        appSessionServiceMock,
      );
      // Then
      expect(oidcClientSessionServiceMock.get).toHaveBeenCalledTimes(1);
      expect(oidcClientSessionServiceMock.get).toHaveBeenCalledWith('spId');
    });

    it('should store identity and acr in session', async () => {
      // Given
      const identityMock = { sub: 'sub' };
      mockIdentityProviderServiceMock.getIdentity.mockResolvedValue(
        identityMock,
      );
      oidcClientSessionServiceMock.get.mockReturnValueOnce('spId');
      // When
      await controller.getLogin(
        next,
        body,
        oidcClientSessionServiceMock,
        appSessionServiceMock,
      );
      // Then
      expect(oidcClientSessionServiceMock.set).toHaveBeenCalledTimes(1);
      expect(oidcClientSessionServiceMock.set).toHaveBeenCalledWith({
        spIdentity: {},
        spAcr: acrMock,
        amr: ['pwd'],
        subs: { spId: 'sub' },
      });
    });

    it('should call next if the identity is found', async () => {
      // Given
      const accountMock = {};
      mockIdentityProviderServiceMock.getIdentity.mockResolvedValue(
        accountMock,
      );
      const interactionId: string = interactionIdMock;
      const body = {
        interactionId,
        login: loginMockValue,
        acr: acrMock,
      };
      // When
      await controller.getLogin(
        next,
        body,
        oidcClientSessionServiceMock,
        appSessionServiceMock,
      );
      // Then
      expect(next).toHaveBeenCalledTimes(1);
    });
  });
});

import { Request, Response } from 'express';

import { ValidationError } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import {
  getDtoInputWithErrors,
  getTransformed,
  InputWithErrorsInterface,
  validateDto,
} from '@fc/common';
import { ConfigService } from '@fc/config';
import { OidcProviderService } from '@fc/oidc-provider';

import { getConfigMock } from '@mocks/config';
import { getSessionServiceMock } from '@mocks/session';

import { MinimalCustomIdentityInterface } from '../interfaces';
import { MockIdentityProviderService } from '../services';
import { MockIdentityProviderController } from './mock-identity-provider.controller';

jest.mock('@fc/common', () => ({
  ...jest.requireActual('@fc/common'),
  validateDto: jest.fn(),
  getTransformed: jest.fn(),
  getDtoInputWithErrors: jest.fn(),
}));

describe('MockIdentityProviderController', () => {
  let controller: MockIdentityProviderController;

  const validateDtoMock = jest.mocked(validateDto);
  const getTransformedMock = jest.mocked(getTransformed);
  const getDtoInputWithErrorsMock = jest.mocked(getDtoInputWithErrors);

  const configMock = getConfigMock();

  const req = {
    fc: {
      interactionId: 'interactionIdMockValue',
    },
  } as unknown as Request;
  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
  } as unknown as Response;

  const oidcClientServiceMock = {
    getAuthorizeUrl: jest.fn(),
    getTokenSet: jest.fn(),
    getUserInfo: jest.fn(),
    wellKnownKeys: jest.fn(),
    buildAuthorizeParameters: jest.fn(),
    finishInteraction: jest.fn(),
  };

  const oidcClientSessionServiceMock = getSessionServiceMock();

  const appSessionServiceMock = getSessionServiceMock();

  const oidcProviderServiceMock = {
    getInteraction: jest.fn(),
    finishInteraction: jest.fn(),
  };

  const mockIdentityProviderServiceMock = {
    getIdentity: jest.fn(),
    isPasswordValid: jest.fn(),
    getSub: jest.fn(),
  };

  const interactionIdMock = 'interactionIdMockValue';
  const acrMock = 'eidas2';
  const scopeMock = 'scopeMock';
  const providerUidMock = 'providerUidMock';
  const loginMockValue = 'loginMockValue';
  const passwordMockValue = 'passwordMockValue';
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
        ConfigService,
        OidcProviderService,
        MockIdentityProviderService,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configMock)
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
    it('Should return some status object', () => {
      // action
      const result = controller.index();
      // assert
      expect(result).toEqual({ status: 'ok' });
    });
  });

  describe('getInteraction', () => {
    const appSessionServiceMock = getSessionServiceMock();
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
        login: 'test',
      });
    });
  });

  describe('getLogin', () => {
    const interactionId: string = interactionIdMock;
    const body = {
      login: loginMockValue,
      password: passwordMockValue,
      interactionId,
      acr: acrMock,
    };

    beforeEach(() => {
      mockIdentityProviderServiceMock.isPasswordValid.mockReturnValue(true);
    });

    it('should call service.getIdentity() to retrieve sp identity', async () => {
      // Given
      const identityMock = {};
      mockIdentityProviderServiceMock.getIdentity.mockResolvedValue(
        identityMock,
      );
      // When
      await controller.getLogin(
        req,
        res,
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

    it('should throw an error and not call oidcProvider.finishInteraction() if the identity is not found', async () => {
      // Given
      mockIdentityProviderServiceMock.getIdentity.mockResolvedValue(undefined);
      const interactionId: string = interactionIdMock;
      const body = {
        interactionId,
        login: loginMockValue,
        password: passwordMockValue,
        acr: acrMock,
      };
      const expectedError = new Error('Identity not found in database');

      // When / Then
      await expect(() =>
        controller.getLogin(
          req,
          res,
          body,
          oidcClientSessionServiceMock,
          appSessionServiceMock,
        ),
      ).rejects.toThrow(expectedError);
      expect(oidcProviderServiceMock.finishInteraction).toHaveBeenCalledTimes(
        0,
      );
    });

    it('should check if password is valid', async () => {
      // Given
      const identityMock = {
        password: passwordMockValue,
      };
      mockIdentityProviderServiceMock.getIdentity.mockResolvedValue(
        identityMock,
      );
      const interactionId: string = interactionIdMock;
      const body = {
        interactionId,
        login: loginMockValue,
        password: `${passwordMockValue}_foo`,
        acr: acrMock,
      };

      // When
      await controller.getLogin(
        req,
        res,
        body,
        oidcClientSessionServiceMock,
        appSessionServiceMock,
      );

      // Then
      expect(
        mockIdentityProviderServiceMock.isPasswordValid,
      ).toHaveBeenCalledTimes(1);
      expect(
        mockIdentityProviderServiceMock.isPasswordValid,
      ).toHaveBeenCalledWith(passwordMockValue, body.password);
    });

    it('should throw an error and not call "next" if the password is not valid', async () => {
      // Given
      mockIdentityProviderServiceMock.isPasswordValid.mockReturnValueOnce(
        false,
      );
      const identityMock = {
        password: passwordMockValue,
      };
      mockIdentityProviderServiceMock.getIdentity.mockResolvedValue(
        identityMock,
      );
      const interactionId: string = interactionIdMock;
      const body = {
        interactionId,
        login: loginMockValue,
        password: `${passwordMockValue}_foo`,
        acr: acrMock,
      };
      const expectedError = new Error('Password is invalid');

      // When / Then
      await expect(() =>
        controller.getLogin(
          req,
          res,
          body,
          oidcClientSessionServiceMock,
          appSessionServiceMock,
        ),
      ).rejects.toThrow(expectedError);
    });

    it('should save the login in app session', async () => {
      // Given
      const identityMock = {};
      mockIdentityProviderServiceMock.getIdentity.mockResolvedValue(
        identityMock,
      );
      // When
      await controller.getLogin(
        req,
        res,
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
        req,
        res,
        body,
        oidcClientSessionServiceMock,
        appSessionServiceMock,
      );
      // Then
      expect(oidcClientSessionServiceMock.get).toHaveBeenCalledTimes(2);
      expect(oidcClientSessionServiceMock.get).toHaveBeenNthCalledWith(
        1,
        'spId',
      );
      expect(oidcClientSessionServiceMock.get).toHaveBeenNthCalledWith(2);
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
        req,
        res,
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
        password: passwordMockValue,
        acr: acrMock,
      };
      // When
      await controller.getLogin(
        req,
        res,
        body,
        oidcClientSessionServiceMock,
        appSessionServiceMock,
      );
      // Then
      expect(oidcProviderServiceMock.finishInteraction).toHaveBeenCalledTimes(
        1,
      );
    });
  });

  describe('prepareIdentity', () => {
    beforeEach(() => {
      mockIdentityProviderServiceMock.getSub.mockReturnValue('subValue');
      oidcClientSessionServiceMock.get.mockReturnValue({ spId: 'spId' });
    });

    it('should set acr to value given in identity', async () => {
      // Given
      const identityMock = {
        acr: 'acrValue',
      } as unknown as MinimalCustomIdentityInterface;

      // When
      await controller['prepareIdentity'](
        identityMock,
        oidcClientSessionServiceMock,
      );

      // Then
      expect(oidcClientSessionServiceMock.set).toHaveBeenCalledTimes(1);
      expect(oidcClientSessionServiceMock.set).toHaveBeenCalledWith(
        expect.objectContaining({
          spAcr: 'acrValue',
        }),
      );
    });

    it('should set sub to an object with the spId from session as key and the result of call to mockIdentityProviderServiceMock.getSub() as value', async () => {
      // Given
      const identityMock = {} as unknown as MinimalCustomIdentityInterface;

      // When
      await controller['prepareIdentity'](
        identityMock,
        oidcClientSessionServiceMock,
      );

      // Then
      expect(oidcClientSessionServiceMock.set).toHaveBeenCalledTimes(1);
      expect(oidcClientSessionServiceMock.set).toHaveBeenCalledWith(
        expect.objectContaining({
          subs: {
            spId: 'subValue',
          },
        }),
      );
    });

    it('should set amr value to pwd', async () => {
      // Given
      const identityMock = {} as unknown as MinimalCustomIdentityInterface;

      // When
      await controller['prepareIdentity'](
        identityMock,
        oidcClientSessionServiceMock,
      );

      // Then
      expect(oidcClientSessionServiceMock.set).toHaveBeenCalledTimes(1);
      expect(oidcClientSessionServiceMock.set).toHaveBeenCalledWith(
        expect.objectContaining({
          amr: ['pwd'],
        }),
      );
    });
  });

  describe('getLoginCustom', () => {
    it('should return identityForm and data', () => {
      // Given
      const identityFormMock = Symbol('identityFormMock');
      configMock.get.mockReturnValueOnce({
        identityForm: identityFormMock,
      });
      // When
      const result = controller.getLoginCustom();
      // Then
      expect(result).toEqual({
        identityForm: identityFormMock,
        data: expect.toBeEmptyObject(),
      });
    });
  });

  describe('postLoginCustom', () => {
    // Given
    const identityMock = Symbol(
      'identityMock',
    ) as unknown as MinimalCustomIdentityInterface;
    const transformedIdentityMock = Symbol(
      'transformedIdentityMock',
    ) as unknown as MinimalCustomIdentityInterface;
    const identityDtoMock = Symbol('identityDtoMock');
    const identityFormMock = Symbol('identityFormMock');

    beforeEach(() => {
      configMock.get.mockReturnValue({
        identityDto: identityDtoMock,
        identityForm: identityFormMock,
      });

      controller['prepareIdentity'] = jest.fn();
    });

    it('should validate DTO with identity and configured DTO', async () => {
      // Given
      validateDtoMock.mockResolvedValueOnce([]);

      // When
      await controller['postLoginCustom'](
        identityMock,
        req,
        res,
        oidcClientSessionServiceMock,
      );

      // Then
      expect(validateDtoMock).toHaveBeenCalledTimes(1);
      expect(validateDtoMock).toHaveBeenCalledWith(
        identityMock,
        identityDtoMock,
        { whitelist: true },
      );
    });

    it('should call getDtoInputWithErrors if there are errors', async () => {
      // Given
      const errors = [Symbol('error')] as unknown as ValidationError[];
      validateDtoMock.mockResolvedValueOnce(errors);

      // When
      await controller['postLoginCustom'](
        identityMock,
        req,
        res,
        oidcClientSessionServiceMock,
      );

      // Then
      expect(getDtoInputWithErrors).toHaveBeenCalledTimes(1);
      expect(getDtoInputWithErrors).toHaveBeenCalledWith(errors);
    });

    it('should not call getDtoInputWithErrors and res.render() if there are no errors', async () => {
      // Given
      const errors = [] as unknown as ValidationError[];
      validateDtoMock.mockResolvedValueOnce(errors);

      // When
      await controller['postLoginCustom'](
        identityMock,
        req,
        res,
        oidcClientSessionServiceMock,
      );

      // Then
      expect(getDtoInputWithErrors).not.toHaveBeenCalled();
      expect(res.render).not.toHaveBeenCalled();
    });

    it('should call res.render() if there are errors', async () => {
      // Given
      const errors = [Symbol('error')] as unknown as ValidationError[];
      const dataMock = Symbol('dataMock') as unknown as Record<
        string,
        InputWithErrorsInterface
      >;
      validateDtoMock.mockResolvedValueOnce(errors);
      getDtoInputWithErrorsMock.mockReturnValueOnce(dataMock);

      // When
      await controller['postLoginCustom'](
        identityMock,
        req,
        res,
        oidcClientSessionServiceMock,
      );

      // Then
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith('interaction-login-custom', {
        identityForm: identityFormMock,
        data: dataMock,
      });
    });

    it('should not call prepareIdentity() and oidcProvider.finishInteraction() if there are errors', async () => {
      // Given
      const errors = [Symbol('error')] as unknown as ValidationError[];
      validateDtoMock.mockResolvedValueOnce(errors);

      // When
      await controller['postLoginCustom'](
        identityMock,
        req,
        res,
        oidcClientSessionServiceMock,
      );

      // Then
      expect(controller['prepareIdentity']).not.toHaveBeenCalled();
      expect(oidcProviderServiceMock.finishInteraction).not.toHaveBeenCalled();
    });

    it('should call prepareIdentity() if there are no errors', async () => {
      // Given
      const errors = [] as unknown as ValidationError[];
      validateDtoMock.mockResolvedValueOnce(errors);
      getTransformedMock.mockReturnValueOnce(transformedIdentityMock);

      // When
      await controller['postLoginCustom'](
        identityMock,
        req,
        res,
        oidcClientSessionServiceMock,
      );

      // Then
      expect(controller['prepareIdentity']).toHaveBeenCalledTimes(1);
      expect(controller['prepareIdentity']).toHaveBeenCalledWith(
        transformedIdentityMock,
        oidcClientSessionServiceMock,
      );
    });

    it('should call sessionOidc.get() if there are no errors', async () => {
      // Given
      const errors = [] as unknown as ValidationError[];
      validateDtoMock.mockResolvedValueOnce(errors);

      // When
      await controller['postLoginCustom'](
        identityMock,
        req,
        res,
        oidcClientSessionServiceMock,
      );

      // Then
      expect(oidcClientSessionServiceMock.get).toHaveBeenCalledTimes(1);
    });

    it('should call oidcProvider.finishInteraction() if there are no errors', async () => {
      // Given
      const errors = [] as unknown as ValidationError[];
      validateDtoMock.mockResolvedValueOnce(errors);

      const sessionMock = Symbol('sessionMock');
      oidcClientSessionServiceMock.get.mockResolvedValueOnce(sessionMock);
      // When
      await controller['postLoginCustom'](
        identityMock,
        req,
        res,
        oidcClientSessionServiceMock,
      );

      // Then
      expect(oidcProviderServiceMock.finishInteraction).toHaveBeenCalledTimes(
        1,
      );
      expect(oidcProviderServiceMock.finishInteraction).toHaveBeenCalledWith(
        req,
        res,
        sessionMock,
      );
    });
  });
});

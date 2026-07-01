import { Response } from 'express';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { EudiPresentationId } from '@fc/eudi';
import { Openid4vpService } from '@fc/openid4vp';
import { QrcodeService } from '@fc/qrcode';

import { getConfigMock } from '@mocks/config';

import { Routes } from '../enums';
import { OpenId4vpUiController } from './openid4vp-ui.controller';

describe('OpenId4vpUiController', () => {
  let controller: OpenId4vpUiController;

  const configMock = getConfigMock();
  const openid4vpServiceMock = {
    getRequestById: jest.fn(),
    createAuthorizationRequest: jest.fn(),
    getInteractionById: jest.fn(),
    getAuthorizeRequestUri: jest.fn(),
  };
  const qrcodeServiceMock = {
    generateDataUrl: jest.fn(),
  };

  const urlPrefixMock = 'https://wallet-bridge.example';
  const appConfigMock = { urlPrefix: urlPrefixMock };
  const openid4vpConfigMock = {
    relayingParty: { interactionTtl: 600 },
  };

  const interactionIdMock = '11111111-1111-1111-1111-111111111111';

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OpenId4vpUiController],
      providers: [ConfigService, Openid4vpService, QrcodeService],
    })
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(Openid4vpService)
      .useValue(openid4vpServiceMock)
      .overrideProvider(QrcodeService)
      .useValue(qrcodeServiceMock)
      .compile();

    controller = module.get<OpenId4vpUiController>(OpenId4vpUiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('authorizeRequest', () => {
    const resMock = {
      redirect: jest.fn(),
    } as unknown as Response;
    const requestMock = { presentationId: 'pid-full' };

    beforeEach(() => {
      configMock.get.mockReturnValue(appConfigMock);
      openid4vpServiceMock.getRequestById.mockReturnValue(requestMock);
      openid4vpServiceMock.createAuthorizationRequest.mockResolvedValue(
        interactionIdMock,
      );
    });

    it('should resolve the App configuration', async () => {
      // When
      await controller.authorizeRequest(resMock);

      // Then
      expect(configMock.get).toHaveBeenCalledExactlyOnceWith('App');
    });

    it('should resolve the request configuration with the pid-full identifier', async () => {
      // When
      await controller.authorizeRequest(resMock);

      // Then
      expect(
        openid4vpServiceMock.getRequestById,
      ).toHaveBeenCalledExactlyOnceWith(EudiPresentationId.PID_FC);
    });

    it('should create a new authorization request from the resolved request configuration', async () => {
      // When
      await controller.authorizeRequest(resMock);

      // Then
      expect(
        openid4vpServiceMock.createAuthorizationRequest,
      ).toHaveBeenCalledExactlyOnceWith(requestMock);
    });

    it('should redirect to the authorize-request-uri route with the new interaction id', async () => {
      // When
      await controller.authorizeRequest(resMock);

      // Then
      expect(resMock.redirect).toHaveBeenCalledExactlyOnceWith(
        `${urlPrefixMock}${Routes.OPENID4VP_AUTHORIZE_REQUEST_URI.replace(
          ':interactionId',
          interactionIdMock,
        )}`,
      );
    });
  });

  describe('authorizeRequestUri', () => {
    const interactionMock = {
      id: interactionIdMock,
      presentationId: 'presentationIdMock',
    };
    const requestUriMock = `openid4vp://authorize?client_id=clientIdMock&request_uri=${encodeURIComponent(
      'https://wallet-bridge.example/request/abc',
    )}&response_type=vp_token`;
    const qrcodeDataUrlMock = 'data:image/png;base64,qrcodeMock';

    beforeEach(() => {
      configMock.get
        .mockReturnValueOnce(appConfigMock)
        .mockReturnValueOnce(openid4vpConfigMock);

      openid4vpServiceMock.getInteractionById.mockResolvedValue(
        interactionMock,
      );

      openid4vpServiceMock.getAuthorizeRequestUri.mockReturnValue(
        requestUriMock,
      );

      qrcodeServiceMock.generateDataUrl.mockResolvedValue(qrcodeDataUrlMock);
    });

    it('should fetch the interaction with the provided interactionId', async () => {
      // When
      await controller.authorizeRequestUri({
        interactionId: interactionIdMock,
      });

      // Then
      expect(
        openid4vpServiceMock.getInteractionById,
      ).toHaveBeenCalledExactlyOnceWith(interactionIdMock);
    });

    it('should build the authorize request uri from the interaction', async () => {
      // When
      await controller.authorizeRequestUri({
        interactionId: interactionIdMock,
      });

      // Then
      expect(
        openid4vpServiceMock.getAuthorizeRequestUri,
      ).toHaveBeenCalledExactlyOnceWith(interactionMock);
    });

    it('should generate a QRcode for the request URI with a high error-correction level', async () => {
      // When
      await controller.authorizeRequestUri({
        interactionId: interactionIdMock,
      });

      // Then
      expect(qrcodeServiceMock.generateDataUrl).toHaveBeenCalledExactlyOnceWith(
        requestUriMock,
        { errorCorrectionLevel: 'H' },
      );
    });

    it('should return the request uri and the QR code', async () => {
      // When
      const result = await controller.authorizeRequestUri({
        interactionId: interactionIdMock,
      });

      // Then
      expect(result).toEqual(
        expect.objectContaining({
          requestUri: requestUriMock,
          qrcodeDataUrl: qrcodeDataUrlMock,
        }),
      );
    });

    it('should return the success url built from the urlPrefix and the interaction id', async () => {
      // When
      const result = await controller.authorizeRequestUri({
        interactionId: interactionIdMock,
      });

      // Then
      expect(result.successUrl).toBe(
        `${urlPrefixMock}${Routes.OPENID4VP_AUTHORIZE_REDIRECT.replace(
          ':interactionId',
          interactionIdMock,
        )}`,
      );
    });

    it('should return the status url built from the urlPrefix and the interaction id', async () => {
      // When
      const result = await controller.authorizeRequestUri({
        interactionId: interactionIdMock,
      });

      // Then
      expect(result.statusUrl).toBe(
        `${urlPrefixMock}${Routes.OPENID4VP_AUTHORIZE_REQUEST_STATUS.replace(
          ':interactionId',
          interactionIdMock,
        )}`,
      );
    });

    it('should return the configured interactionTtl as timeout', async () => {
      // When
      const result = await controller.authorizeRequestUri({
        interactionId: interactionIdMock,
      });

      // Then
      expect(result.timeout).toBe(
        openid4vpConfigMock.relayingParty.interactionTtl,
      );
    });

    it('should expose the request_uri search parameter as httpRequestUri', async () => {
      // When
      const result = await controller.authorizeRequestUri({
        interactionId: interactionIdMock,
      });

      // Then
      expect(result.httpRequestUri).toBe(
        new URL(requestUriMock).searchParams.get('request_uri'),
      );
    });
  });

  describe('authorizeRedirect', () => {
    it('should return the "Hello World" placeholder', () => {
      // When
      const result = controller.authorizeRedirect();

      // Then
      expect(result).toBe('Hello World');
    });
  });

  describe('authorizeRequestStatus', () => {
    it('should return the "Hello World" placeholder', () => {
      // When
      const result = controller.authorizeRequestStatus();

      // Then
      expect(result).toBe('Hello World');
    });
  });
});

import { Request, Response } from 'express';
import { Observable, of } from 'rxjs';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { Openid4vpService } from '@fc/openid4vp';
import { QrcodeErrorCorrectionLevel, QrcodeService } from '@fc/qrcode';

import { getConfigMock } from '@mocks/config';

import { QRCODE_WIDTH_PX } from '../constants';
import { WalletBridgeRoutes } from '../enums';
import { SseService } from '../services';
import { WalletBridgeIdentityService } from '../services/wallet-bridge-identity.service';
import { OpenId4vpUiController } from './openid4vp-ui.controller';

describe('OpenId4vpUiController', () => {
  let controller: OpenId4vpUiController;

  const configMock = getConfigMock();
  const openid4vpServiceMock = {
    getRequestById: jest.fn(),
    createAuthorizationRequest: jest.fn(),
    getInteractionById: jest.fn(),
    getAuthorizeRequestUri: jest.fn(),
    getUserInteractionById: jest.fn(),
  };
  const qrcodeServiceMock = {
    generateDataUrl: jest.fn(),
  };
  const sseMock = {
    buildSseStream: jest.fn(),
  };
  const walletBridgeIdentityServiceMock = {
    finishInteraction: jest.fn(),
  };

  const urlPrefixMock = 'https://wallet-bridge.example';
  const appConfigMock = { urlPrefix: urlPrefixMock };
  const openid4vpConfigMock = {
    relayingParty: {
      interactionTtl: 600,
      redirectDelay: 2,
      requestUri: '/api/authorize-request-object/:interactionId',
    },
  };

  const interactionIdMock = '11111111-1111-1111-1111-111111111111';

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OpenId4vpUiController],
      providers: [
        ConfigService,
        Openid4vpService,
        QrcodeService,
        SseService,
        WalletBridgeIdentityService,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(Openid4vpService)
      .useValue(openid4vpServiceMock)
      .overrideProvider(QrcodeService)
      .useValue(qrcodeServiceMock)
      .overrideProvider(SseService)
      .useValue(sseMock)
      .overrideProvider(WalletBridgeIdentityService)
      .useValue(walletBridgeIdentityServiceMock)
      .compile();

    controller = module.get<OpenId4vpUiController>(OpenId4vpUiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

    it('should generate a QRcode for the request URI with a low error-correction level', async () => {
      // When
      await controller.authorizeRequestUri({
        interactionId: interactionIdMock,
      });

      // Then
      expect(qrcodeServiceMock.generateDataUrl).toHaveBeenCalledExactlyOnceWith(
        requestUriMock,
        {
          errorCorrectionLevel: QrcodeErrorCorrectionLevel.LOW,
          margin: 0,
          width: QRCODE_WIDTH_PX,
        },
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
        `${urlPrefixMock}${WalletBridgeRoutes.OPENID4VP_AUTHORIZE_REDIRECT.replace(
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
        `${urlPrefixMock}${WalletBridgeRoutes.OPENID4VP_AUTHORIZE_REQUEST_STATUS.replace(
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

    it('should return the configured redirectDelay', async () => {
      // When
      const result = await controller.authorizeRequestUri({
        interactionId: interactionIdMock,
      });

      // Then
      expect(result.redirectDelay).toBe(
        openid4vpConfigMock.relayingParty.redirectDelay,
      );
    });

    it('should expose the request_uri built from config and interactionId as httpRequestUri', async () => {
      // When
      const result = await controller.authorizeRequestUri({
        interactionId: interactionIdMock,
      });

      // Then
      expect(result.httpRequestUri).toBe(
        openid4vpConfigMock.relayingParty.requestUri.replace(
          ':interactionId',
          interactionIdMock,
        ),
      );
    });
  });

  describe('authorizeRedirect', () => {
    // Given

    const paramsMock = {
      interactionId: interactionIdMock,
    };
    const reqMock = {} as Request;
    const resMock = {} as Response;
    const interactionMock = {
      id: interactionIdMock,
      presentationId: 'presentationIdMock',
    };

    it('should fetch the interaction for the user based on the interactionId', async () => {
      // When
      await controller.authorizeRedirect(paramsMock, reqMock, resMock);

      // Then
      expect(
        openid4vpServiceMock.getUserInteractionById,
      ).toHaveBeenCalledExactlyOnceWith(interactionIdMock);
    });

    it('should finish the interaction for the user', async () => {
      // Given
      openid4vpServiceMock.getUserInteractionById.mockResolvedValue(
        interactionMock,
      );

      // When
      await controller.authorizeRedirect(paramsMock, reqMock, resMock);

      // Then
      expect(
        walletBridgeIdentityServiceMock.finishInteraction,
      ).toHaveBeenCalledExactlyOnceWith(reqMock, resMock, interactionMock);
    });
  });

  describe('authorizeRequestStatus', () => {
    beforeEach(() => {
      sseMock.buildSseStream.mockReturnValue(of());
    });

    it('should delegate to SseService.buildSseStream', () => {
      // When
      controller.authorizeRequestStatus({ interactionId: interactionIdMock });

      // Then
      expect(sseMock.buildSseStream).toHaveBeenCalledExactlyOnceWith(
        interactionIdMock,
      );
    });

    it('should return the Observable from SseService.buildSseStream', () => {
      // Given
      const streamMock = new Observable();
      sseMock.buildSseStream.mockReturnValue(streamMock);

      // When
      const result = controller.authorizeRequestStatus({
        interactionId: interactionIdMock,
      });

      // Then
      expect(result).toBe(streamMock);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';

import { parameterizedPath, validateDto } from '@fc/common';
import { ConfigService } from '@fc/config';
import { extractSimpleDocument } from '@fc/mdoc';
import { Openid4vpInteractionStatus, Openid4vpService } from '@fc/openid4vp';

import { getConfigMock } from '@mocks/config';

import {
  WalletBridgeInvalidInteractionStatusException,
  WalletBridgeInvalidPidException,
} from '../exceptions';
import { OpenId4vpApiController } from './openid4vp-api.controller';

jest.mock('@fc/common', () => ({
  ...jest.requireActual('@fc/common'),
  parameterizedPath: jest.fn(),
  validateDto: jest.fn(),
}));

jest.mock('@fc/mdoc', () => ({
  ...jest.requireActual('@fc/mdoc'),
  extractSimpleDocument: jest.fn(),
}));

describe('OpenId4vpApiController', () => {
  let controller: OpenId4vpApiController;

  const configMock = getConfigMock();
  const openid4vpServiceMock = {
    getInteractionById: jest.fn(),
    getRequestObject: jest.fn(),
    setAuthorizationRequestObjectAsRead: jest.fn(),
    getInteractionByState: jest.fn(),
    parseResponse: jest.fn(),
    saveResponse: jest.fn(),
  };

  const parameterizedPathMock = jest.mocked(parameterizedPath);
  const validateDtoMock = jest.mocked(validateDto);
  const extractSimpleDocumentMock = jest.mocked(extractSimpleDocument);

  const interactionMock = {
    id: 'interactionIdMock',
    presentationId: 'presentationIdMock',
    state: 'stateMock',
    status: Openid4vpInteractionStatus.REQUEST_OBJECT_PROVIDED,
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OpenId4vpApiController],
      providers: [ConfigService, Openid4vpService],
    })
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(Openid4vpService)
      .useValue(openid4vpServiceMock)
      .compile();

    controller = module.get<OpenId4vpApiController>(OpenId4vpApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('authorizeRequestObject', () => {
    const requestObjectMock = {
      jar: { authorizationRequestJwt: 'authorizationRequestJwtMock' },
    };

    beforeEach(() => {
      openid4vpServiceMock.getInteractionById.mockResolvedValue(
        interactionMock,
      );
      openid4vpServiceMock.getRequestObject.mockResolvedValue(
        requestObjectMock,
      );
    });

    it('should retrieve the interaction from the provided interaction id', async () => {
      // When
      await controller.authorizeRequestObject({
        interactionId: interactionMock.id,
      });

      // Then
      expect(
        openid4vpServiceMock.getInteractionById,
      ).toHaveBeenCalledExactlyOnceWith(interactionMock.id);
    });

    it('should build the request object from the interaction', async () => {
      // When
      await controller.authorizeRequestObject({
        interactionId: interactionMock.id,
      });

      // Then
      expect(
        openid4vpServiceMock.getRequestObject,
      ).toHaveBeenCalledExactlyOnceWith(interactionMock);
    });

    it('should mark the authorization request object as read', async () => {
      // When
      await controller.authorizeRequestObject({
        interactionId: interactionMock.id,
      });

      // Then
      expect(
        openid4vpServiceMock.setAuthorizationRequestObjectAsRead,
      ).toHaveBeenCalledExactlyOnceWith(interactionMock);
    });

    it('should return the JAR authorization request JWT', async () => {
      // When
      const result = await controller.authorizeRequestObject({
        interactionId: interactionMock.id,
      });

      // Then
      expect(result).toBe('authorizationRequestJwtMock');
    });
  });

  describe('authorizeResponse', () => {
    const bodyMock = {
      state: 'stateMock',
      response: 'nonsensicalcborencodedstring',
    };
    const documentsMock = [{ docType: 'eu.europa.ec.eudi.pid.1' }];
    const identityMock = {
      docType: 'eu.europa.ec.eudi.pid.1',
      claims: {},
    };
    const redirectUriMock =
      'https://relying-party.example/redirect/:interactionId';
    const interpolatedRedirectUriMock =
      'https://relying-party.example/redirect/interactionIdMock';

    beforeEach(() => {
      openid4vpServiceMock.getInteractionByState.mockResolvedValue(
        interactionMock,
      );
      openid4vpServiceMock.parseResponse.mockResolvedValue(documentsMock);
      extractSimpleDocumentMock.mockReturnValue(identityMock);
      validateDtoMock.mockResolvedValue([]);
      configMock.get.mockReturnValue({
        relayingParty: { redirectUri: redirectUriMock },
      });
      parameterizedPathMock.mockReturnValue(interpolatedRedirectUriMock);
    });

    it('should retrieve the interaction from the state', async () => {
      // When
      await controller.authorizeResponse(bodyMock);

      // Then
      expect(
        openid4vpServiceMock.getInteractionByState,
      ).toHaveBeenCalledExactlyOnceWith(bodyMock.state);
    });

    it('should throw WalletBridgeInvalidInteractionStatusException when the interaction status is not valid', async () => {
      // Given
      openid4vpServiceMock.getInteractionByState.mockResolvedValue({
        ...interactionMock,
        status: Openid4vpInteractionStatus.REQUEST_URI_PROVIDED,
      });

      // When / Then
      await expect(controller.authorizeResponse(bodyMock)).rejects.toThrow(
        WalletBridgeInvalidInteractionStatusException,
      );
    });

    it('should parse the response payload with the interaction', async () => {
      // When
      await controller.authorizeResponse(bodyMock);

      // Then
      expect(
        openid4vpServiceMock.parseResponse,
      ).toHaveBeenCalledExactlyOnceWith(bodyMock, interactionMock);
    });

    it('should extract the PID document from the parsed documents', async () => {
      // When
      await controller.authorizeResponse(bodyMock);

      // Then
      expect(extractSimpleDocumentMock).toHaveBeenCalledExactlyOnceWith(
        documentsMock,
        'eu.europa.ec.eudi.pid.1',
      );
    });

    it('should validate the extracted PID identity with whitelist option', async () => {
      // When
      await controller.authorizeResponse(bodyMock);

      // Then
      expect(validateDtoMock).toHaveBeenCalledExactlyOnceWith(
        identityMock,
        expect.any(Function),
        { whitelist: true },
      );
    });

    it('should throw WalletBridgeInvalidPidClaimsException when validation fails', async () => {
      // Given
      validateDtoMock
        .mockReset()
        .mockResolvedValue([{ property: 'family_name' }]);

      // When / Then
      await expect(controller.authorizeResponse(bodyMock)).rejects.toThrow(
        WalletBridgeInvalidPidException,
      );
    });

    it('should not save the response when validation fails', async () => {
      // Given
      validateDtoMock
        .mockReset()
        .mockResolvedValue([{ property: 'family_name' }]);

      // When
      await expect(controller.authorizeResponse(bodyMock)).rejects.toThrow();

      // Then
      expect(openid4vpServiceMock.saveResponse).not.toHaveBeenCalled();
    });

    it('should save the response when validation succeeds', async () => {
      // When
      await controller.authorizeResponse(bodyMock);

      // Then
      expect(openid4vpServiceMock.saveResponse).toHaveBeenCalledExactlyOnceWith(
        interactionMock,
        [identityMock],
      );
    });

    it('should build the redirect uri by interpolating the interaction id', async () => {
      // When
      await controller.authorizeResponse(bodyMock);

      // Then
      expect(parameterizedPathMock).toHaveBeenCalledExactlyOnceWith(
        redirectUriMock,
        { interactionId: interactionMock.id },
      );
    });

    it('should return the interpolated redirect uri', async () => {
      // When
      const result = await controller.authorizeResponse(bodyMock);

      // Then
      expect(result).toEqual({ redirect_uri: interpolatedRedirectUriMock });
    });
  });
});

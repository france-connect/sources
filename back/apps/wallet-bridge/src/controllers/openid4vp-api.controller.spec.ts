import { Test, TestingModule } from '@nestjs/testing';

import { parameterizedPath, validateDto } from '@fc/common';
import { ConfigService } from '@fc/config';
import { EudiDocTypes, EudiPidDto } from '@fc/eudi';
import { extractSimpleDocument } from '@fc/mdoc';
import {
  Openid4vpAuthorizationError,
  Openid4vpInteractionDto,
  Openid4vpInteractionStatus,
  Openid4vpService,
} from '@fc/openid4vp';

import { getConfigMock } from '@mocks/config';

import { DEFAULT_ERROR, DEFAULT_ERROR_DESCRIPTION } from '../constants';
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
    saveError: jest.fn(),
  };

  const parameterizedPathMock = jest.mocked(parameterizedPath);
  const validateDtoMock = jest.mocked(validateDto);
  const extractSimpleDocumentMock = jest.mocked(extractSimpleDocument);

  const interactionMock: Openid4vpInteractionDto = {
    id: 'interactionIdMock',
    presentationId: 'presentationIdMock',
    state: 'stateMock',
    nonce: 'nonceMock',
    iat: 1700000000,
    exp: 1700000600,
    status: Openid4vpInteractionStatus.REQUEST_OBJECT_PROVIDED,
    sessionId: 'sessionIdMock',
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
    const identityMock = {
      docType: EudiDocTypes.PID,
      claims: {},
    };
    const redirectUriMock =
      'https://relying-party.example/redirect/:interactionId';
    const interpolatedRedirectUriMock =
      'https://relying-party.example/redirect/interactionIdMock';

    beforeEach(() => {
      controller['saveWalletError'] = jest.fn();
      controller['extractIdentity'] = jest.fn().mockResolvedValue(identityMock);

      openid4vpServiceMock.getInteractionByState.mockResolvedValue(
        interactionMock,
      );
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

    it('should extract the identity from the body and the interaction', async () => {
      // When
      await controller.authorizeResponse(bodyMock);

      // Then
      expect(controller['extractIdentity']).toHaveBeenCalledExactlyOnceWith(
        bodyMock,
        interactionMock,
      );
    });

    it('should save an error with default params and rethrow when the identity extraction fails', async () => {
      // Given
      const extractionErrorMock = new Error('extraction failed');
      controller['extractIdentity'] = jest
        .fn()
        .mockRejectedValue(extractionErrorMock);

      // When
      await expect(controller.authorizeResponse(bodyMock)).rejects.toThrow(
        extractionErrorMock,
      );

      // Then
      expect(openid4vpServiceMock.saveError).toHaveBeenCalledExactlyOnceWith(
        interactionMock,
        DEFAULT_ERROR,
        DEFAULT_ERROR_DESCRIPTION,
      );
    });

    it('should not save the response when the identity extraction fails', async () => {
      // Given
      controller['extractIdentity'] = jest
        .fn()
        .mockRejectedValue(new Error('extraction failed'));

      // When
      await expect(controller.authorizeResponse(bodyMock)).rejects.toThrow();

      // Then
      expect(openid4vpServiceMock.saveResponse).not.toHaveBeenCalled();
    });

    it('should save the response when the identity extraction succeeds', async () => {
      // When
      await controller.authorizeResponse(bodyMock);

      // Then
      expect(openid4vpServiceMock.saveResponse).toHaveBeenCalledExactlyOnceWith(
        interactionMock,
        [identityMock],
      );
    });

    describe('when the wallet notifies an authorization error', () => {
      const errorBodyMock = {
        state: 'stateMock',
        error: Openid4vpAuthorizationError.ACCESS_DENIED,
        error_description: 'User cancelled the authentication',
      };

      it('should delegate the error handling to saveWalletError', async () => {
        // When
        await controller.authorizeResponse(errorBodyMock);

        // Then
        expect(controller['saveWalletError']).toHaveBeenCalledExactlyOnceWith(
          interactionMock,
          errorBodyMock,
        );
      });

      it('should not extract the identity nor save a response', async () => {
        // When
        await controller.authorizeResponse(errorBodyMock);

        // Then
        expect(controller['extractIdentity']).not.toHaveBeenCalled();
        expect(openid4vpServiceMock.saveResponse).not.toHaveBeenCalled();
      });

      it('should return an empty object', async () => {
        // When
        const result = await controller.authorizeResponse(errorBodyMock);

        // Then
        expect(result).toEqual({});
      });
    });

    /**
     * @todo #2619 Same Device Flow
     *
     * Those tests should be removed when the same device flow is implemented.
     *
     * it('should build the redirect uri by interpolating the interaction id', async () => {
     *   // When
     *   await controller.authorizeResponse(bodyMock);
     *
     *   // Then
     *   expect(parameterizedPathMock).toHaveBeenCalledExactlyOnceWith(
     *     redirectUriMock,
     *     { interactionId: interactionMock.id },
     *   );
     * });
     *
     *
     * it('should return the interpolated redirect uri', async () => {
     *   // When
     *   const result = await controller.authorizeResponse(bodyMock);
     *
     *   // Then
     *   expect(result).toEqual({ redirect_uri: interpolatedRedirectUriMock });
     * });
     */
  });

  describe('saveWalletError', () => {
    const errorBodyMock = {
      state: 'stateMock',
      error: Openid4vpAuthorizationError.ACCESS_DENIED,
      error_description: 'User cancelled the authentication',
    };

    it('should save the error provided by the wallet', async () => {
      // When
      await controller['saveWalletError'](interactionMock, errorBodyMock);

      // Then
      expect(openid4vpServiceMock.saveError).toHaveBeenCalledExactlyOnceWith(
        interactionMock,
        errorBodyMock.error,
        errorBodyMock.error_description,
      );
    });

    it('should save the error with a default description when the wallet does not provide one', async () => {
      // When
      await controller['saveWalletError'](interactionMock, {
        state: 'stateMock',
        error: Openid4vpAuthorizationError.ACCESS_DENIED,
      });

      // Then
      expect(openid4vpServiceMock.saveError).toHaveBeenCalledExactlyOnceWith(
        interactionMock,
        Openid4vpAuthorizationError.ACCESS_DENIED,
        DEFAULT_ERROR_DESCRIPTION,
      );
    });
  });

  describe('extractIdentity', () => {
    const bodyMock = {
      state: 'stateMock',
      response: 'nonsensicalcborencodedstring',
    };
    const identityMock = {
      docType: EudiDocTypes.PID,
      claims: {},
    };
    const documentsMock = [{ ...identityMock }];

    beforeEach(() => {
      openid4vpServiceMock.parseResponse.mockResolvedValue(documentsMock);
      extractSimpleDocumentMock.mockReturnValue(identityMock);
      validateDtoMock.mockResolvedValue([]);
    });

    it('should parse the response payload with the interaction', async () => {
      // When
      await controller['extractIdentity'](bodyMock, interactionMock);

      // Then
      expect(
        openid4vpServiceMock.parseResponse,
      ).toHaveBeenCalledExactlyOnceWith(bodyMock, interactionMock);
    });

    it('should extract the PID document from the parsed documents', async () => {
      // When
      await controller['extractIdentity'](bodyMock, interactionMock);

      // Then
      expect(extractSimpleDocumentMock).toHaveBeenCalledExactlyOnceWith(
        documentsMock,
        EudiDocTypes.PID,
      );
    });

    it('should validate the extracted PID identity with whitelist option', async () => {
      // When
      await controller['extractIdentity'](bodyMock, interactionMock);

      // Then
      expect(validateDtoMock).toHaveBeenCalledExactlyOnceWith(
        identityMock,
        EudiPidDto,
        { whitelist: true },
      );
    });

    it('should throw WalletBridgeInvalidPidException when validation fails', async () => {
      // Given
      validateDtoMock.mockResolvedValueOnce([{ property: 'family_name' }]);

      // When / Then
      await expect(
        controller['extractIdentity'](bodyMock, interactionMock),
      ).rejects.toThrow(WalletBridgeInvalidPidException);
    });

    it('should return the extracted identity', async () => {
      // When
      const result = await controller['extractIdentity'](
        bodyMock,
        interactionMock,
      );

      // Then
      expect(result).toBe(identityMock);
    });
  });
});

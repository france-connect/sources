import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { HUB_SIGN_HEADER } from '../constants';
import { Webhooks } from '../decorators';
import { WebhooksService } from '../services';
import { WebhooksGuard } from './webhooks.guard';

jest.mock('../decorators');

describe('WebhooksGuard', () => {
  let guard: WebhooksGuard;

  const webhooksServiceMock = {
    verifySignature: jest.fn(),
  };

  const contextMock = {
    switchToHttp: jest.fn(),
    getRequest: jest.fn(),
  };

  const reflectorMock = {};

  const mockedSignature = 'test-signature';
  const mockedBody = 'test-body';
  const mockedHookName = 'test-hook-name';

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [WebhooksGuard, WebhooksService, Reflector],
    })
      .overrideProvider(WebhooksService)
      .useValue(webhooksServiceMock)
      .overrideProvider(Reflector)
      .useValue(reflectorMock)
      .compile();

    guard = module.get<WebhooksGuard>(WebhooksGuard);

    contextMock.switchToHttp.mockReturnValue(contextMock);
    contextMock.getRequest.mockReturnValue({
      headers: {
        [HUB_SIGN_HEADER]: mockedSignature,
      },
      rawBody: mockedBody,
    });
    jest.mocked(Webhooks.get).mockReturnValue(mockedHookName);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return false if no signature is provided', () => {
      // Given
      contextMock.getRequest.mockReturnValueOnce({
        headers: {},
        body: mockedBody,
      });

      // When
      const result = guard.canActivate(
        contextMock as unknown as ExecutionContext,
      );

      // Then
      expect(result).toBe(false);
    });

    it('should extract hookName from metadata', () => {
      // When
      guard.canActivate(contextMock as unknown as ExecutionContext);

      // Then
      expect(Webhooks.get).toHaveBeenCalledTimes(1);
      expect(Webhooks.get).toHaveBeenCalledWith(
        guard['reflector'],
        contextMock,
      );
    });

    it('should return false if no hookName is provided', () => {
      // Given
      jest.mocked(Webhooks.get).mockReturnValueOnce(undefined);

      // When
      const result = guard.canActivate(
        contextMock as unknown as ExecutionContext,
      );

      // Then
      expect(result).toBe(false);
    });

    it('should verify signature with body and header', () => {
      // Given
      webhooksServiceMock.verifySignature.mockReturnValueOnce(true);

      // When
      guard.canActivate(contextMock as unknown as ExecutionContext);

      // Then
      expect(webhooksServiceMock.verifySignature).toHaveBeenCalledWith(
        mockedHookName,
        mockedBody,
        mockedSignature,
      );
    });

    it('should return true if the signature is valid', () => {
      // Given
      webhooksServiceMock.verifySignature.mockReturnValueOnce(true);

      // When
      const result = guard.canActivate(
        contextMock as unknown as ExecutionContext,
      );

      // Then
      expect(result).toBe(true);
    });

    it('should return false if the signature is invalid', () => {
      // Given
      webhooksServiceMock.verifySignature.mockReturnValueOnce(false);

      // When
      const result = guard.canActivate(
        contextMock as unknown as ExecutionContext,
      );

      // Then
      expect(result).toBe(false);
    });

    it('should return false if no body is provided', () => {
      // Given
      webhooksServiceMock.verifySignature.mockReturnValueOnce(false);
      contextMock.getRequest.mockReturnValueOnce({
        headers: {
          [HUB_SIGN_HEADER]: mockedSignature,
        },
      });

      // When
      const result = guard.canActivate(
        contextMock as unknown as ExecutionContext,
      );

      // Then
      expect(result).toBe(false);
    });
  });
});

import { Request, Response } from 'express';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { Openid4vpAuthorizationError } from '@fc/openid4vp/enums';
import { Openid4vpDeepLinkInterface } from '@fc/openid4vp/interfaces';

import { getConfigMock } from '@mocks/config';

import { SubmitBodyDto, SubmitErrorBodyDto } from '../dto';
import { Flows, MockWalletRoutes } from '../enums';
import { ConsentViewModel, SubmitResult } from '../interfaces';
import { MockWalletFlowService } from '../services';
import { MockWalletController } from './mock-wallet.controller';

describe('MockWalletController', () => {
  let controller: MockWalletController;

  const configMock = getConfigMock();
  const flowMock = {
    selectIdentity: jest.fn(),
    authorize: jest.fn(),
    submit: jest.fn(),
    submitError: jest.fn(),
    authorizeError: jest.fn(),
  };

  const deepLinkMock = {
    parse: jest.fn(),
    requestUri: 'openid4vp://x',
  } as unknown as Openid4vpDeepLinkInterface;

  const resMock = {
    redirect: jest.fn(),
    render: jest.fn(),
    json: jest.fn(),
  } as unknown as Response;

  const reqMock = {
    accepts: jest.fn(),
  } as unknown as Request;

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MockWalletController],
      providers: [ConfigService, MockWalletFlowService],
    })
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(MockWalletFlowService)
      .useValue(flowMock)
      .compile();

    controller = module.get<MockWalletController>(MockWalletController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('home', () => {
    it('should return an empty view model', () => {
      expect(controller.home()).toEqual({
        selectIdentityUrl: MockWalletRoutes.WALLET_SELECT_IDENTITY,
      });
    });
  });

  describe('selectIdentity', () => {
    it('should delegate to the flow service', () => {
      // Given
      const viewModel = {
        url: 'openid4vp://x',
        authorizeUrl: MockWalletRoutes.WALLET_AUTHORIZE,
        identities: [
          {
            index: 0,
            docType: 'pid',
            attributes: { family_name: 'DUPONT', given_name: 'JEAN' },
          },
        ],
      };
      flowMock.selectIdentity.mockReturnValue(viewModel);

      // When
      const result = controller.selectIdentity({
        deepLink: deepLinkMock,
        flow: Flows.CROSS_DEVICE,
      });

      // Then
      expect(flowMock.selectIdentity).toHaveBeenCalledExactlyOnceWith(
        deepLinkMock,
        Flows.CROSS_DEVICE,
      );
      expect(result).toBe(viewModel);
    });
  });

  describe('authorize', () => {
    it('should delegate to the flow service', async () => {
      // Given
      const viewModel = { claims: ['family_name'] };
      flowMock.authorize.mockResolvedValue(viewModel);

      // When
      const result = await controller.authorize({
        deepLink: deepLinkMock,
        identityIndex: 1,
        flow: Flows.CROSS_DEVICE,
      });

      // Then
      expect(flowMock.authorize).toHaveBeenCalledExactlyOnceWith(
        deepLinkMock,
        Flows.CROSS_DEVICE,
        1,
      );
      expect(result).toBe(viewModel);
    });
  });

  describe('submit', () => {
    const body = {
      responseUri: 'https://verifier.example/response',
      responsePayload: {},
      requestPayload: {},
      flow: Flows.CROSS_DEVICE,
    } as unknown as SubmitBodyDto;
    const submitResultMock = { statusCode: 200, responseBody: '{}' };

    beforeEach(() => {
      controller['renderSubmitResult'] = jest.fn();

      flowMock.submit.mockResolvedValue(submitResultMock);
    });

    it('should delegate the submission to the flow service', async () => {
      // When
      await controller.submit(body, reqMock, resMock);

      // Then
      expect(flowMock.submit).toHaveBeenCalledExactlyOnceWith(body);
    });

    it('should render the submit result with the body flow', async () => {
      // When
      await controller.submit(body, reqMock, resMock);

      // Then
      expect(controller['renderSubmitResult']).toHaveBeenCalledExactlyOnceWith(
        body.flow,
        submitResultMock,
        reqMock,
        resMock,
      );
    });
  });

  describe('submitError', () => {
    const body = {
      responseUri: 'https://verifier.example/response',
      requestPayload: {},
      flow: Flows.CROSS_DEVICE,
    } as unknown as SubmitErrorBodyDto;
    const submitResultMock = { statusCode: 201, responseBody: '{}' };

    beforeEach(() => {
      controller['renderSubmitResult'] = jest.fn();

      flowMock.submitError.mockResolvedValue(submitResultMock);
    });

    it('should delegate the error submission to the flow service', async () => {
      // When
      await controller.submitError(body, reqMock, resMock);

      // Then
      expect(flowMock.submitError).toHaveBeenCalledExactlyOnceWith(body);
    });

    it('should render the submit result with the body flow', async () => {
      // When
      await controller.submitError(body, reqMock, resMock);

      // Then
      expect(controller['renderSubmitResult']).toHaveBeenCalledExactlyOnceWith(
        body.flow,
        submitResultMock,
        reqMock,
        resMock,
      );
    });
  });

  describe('authorizeSubmit', () => {
    const consentViewModel = {
      flow: Flows.SAME_DEVICE,
      availableClaims: ['family_name'],
      responseUri: 'https://verifier.example/response',
      responsePreview: '{}',
      requestPayload: JSON.stringify({ foo: 'bar' }),
      responsePayload: JSON.stringify({ baz: 'qux' }),
      presentationDefinition: '{}',
      submitUrl: MockWalletRoutes.WALLET_SUBMIT,
    } as unknown as ConsentViewModel;

    beforeEach(() => {
      flowMock.authorize.mockResolvedValue(consentViewModel);
    });

    it('should reuse authorize then submit and redirect on same-device flows', async () => {
      // Given
      flowMock.submit.mockResolvedValue({
        statusCode: 200,
        responseBody: '{}',
        redirectUri: 'https://verifier.example/cb',
      });
      reqMock.accepts = jest.fn().mockReturnValue(true);

      // When
      await controller.authorizeSubmit(
        {
          deepLink: deepLinkMock,
          identityIndex: 0,
          flow: Flows.SAME_DEVICE,
        },
        reqMock,
        resMock,
      );

      // Then
      expect(flowMock.authorize).toHaveBeenCalledExactlyOnceWith(
        deepLinkMock,
        Flows.SAME_DEVICE,
        0,
      );
      expect(flowMock.submit).toHaveBeenCalledExactlyOnceWith({
        responseUri: 'https://verifier.example/response',
        requestPayload: { foo: 'bar' },
        responsePayload: { baz: 'qux' },
        flow: Flows.SAME_DEVICE,
      });
      expect(resMock.redirect).toHaveBeenCalledExactlyOnceWith(
        'https://verifier.example/cb',
      );
    });

    it('should render the result page when authorizeSubmit is used for a cross-device flow', async () => {
      // Given
      flowMock.authorize.mockResolvedValue({
        ...consentViewModel,
        flow: Flows.CROSS_DEVICE,
      } as unknown as ConsentViewModel);
      flowMock.submit.mockResolvedValue({
        statusCode: 200,
        responseBody: '{}',
      });
      reqMock.accepts = jest.fn().mockReturnValue(true);

      // When
      await controller.authorizeSubmit(
        {
          deepLink: deepLinkMock,
          identityIndex: 0,
          flow: Flows.CROSS_DEVICE,
        },
        reqMock,
        resMock,
      );

      // Then
      expect(resMock.render).toHaveBeenCalledExactlyOnceWith('result', {
        statusCode: 200,
        responseBody: '{}',
        redirectUri: undefined,
        indexUrl: MockWalletRoutes.HOME,
        flow: Flows.CROSS_DEVICE,
      });
    });
  });

  describe('authorizeErrorSubmit', () => {
    const submitResultMock = { statusCode: 201, responseBody: '{}' };

    beforeEach(() => {
      controller['renderSubmitResult'] = jest.fn();

      flowMock.authorizeError.mockResolvedValue(submitResultMock);
    });

    it('should delegate the error submission to the flow service', async () => {
      // When
      await controller.authorizeErrorSubmit(
        { deepLink: deepLinkMock, flow: Flows.CROSS_DEVICE },
        reqMock,
        resMock,
      );

      // Then
      expect(flowMock.authorizeError).toHaveBeenCalledExactlyOnceWith(
        deepLinkMock,
        undefined,
        undefined,
      );
    });

    it('should forward the requested error and description to the flow service', async () => {
      // When
      await controller.authorizeErrorSubmit(
        {
          deepLink: deepLinkMock,
          flow: Flows.CROSS_DEVICE,
          error: Openid4vpAuthorizationError.SERVER_ERROR,
          errorDescription: 'errorDescriptionMock',
        },
        reqMock,
        resMock,
      );

      // Then
      expect(flowMock.authorizeError).toHaveBeenCalledExactlyOnceWith(
        deepLinkMock,
        Openid4vpAuthorizationError.SERVER_ERROR,
        'errorDescriptionMock',
      );
    });

    it('should render the submit result with the query flow', async () => {
      // When
      await controller.authorizeErrorSubmit(
        { deepLink: deepLinkMock, flow: Flows.CROSS_DEVICE },
        reqMock,
        resMock,
      );

      // Then
      expect(controller['renderSubmitResult']).toHaveBeenCalledExactlyOnceWith(
        Flows.CROSS_DEVICE,
        submitResultMock,
        reqMock,
        resMock,
      );
    });
  });

  describe('renderSubmitResult', () => {
    const resultMock: SubmitResult = {
      statusCode: 200,
      responseBody: '{}',
    };

    beforeEach(() => {
      reqMock.accepts = jest.fn().mockReturnValue(true);
    });

    it('should redirect when the verifier returns a redirect uri and the flow is same-device', () => {
      // When
      controller['renderSubmitResult'](
        Flows.SAME_DEVICE,
        { ...resultMock, redirectUri: 'https://verifier.example/cb' },
        reqMock,
        resMock,
      );

      // Then
      expect(resMock.redirect).toHaveBeenCalledExactlyOnceWith(
        'https://verifier.example/cb',
      );
    });

    it('should render the result page when the flow is cross-device', () => {
      // When
      controller['renderSubmitResult'](
        Flows.CROSS_DEVICE,
        resultMock,
        reqMock,
        resMock,
      );

      // Then
      expect(resMock.render).toHaveBeenCalledExactlyOnceWith('result', {
        statusCode: 200,
        responseBody: '{}',
        redirectUri: undefined,
        indexUrl: MockWalletRoutes.HOME,
        flow: Flows.CROSS_DEVICE,
      });
    });

    it('should return JSON when the flow is cross-device and the client does not accept HTML', () => {
      // Given
      reqMock.accepts = jest.fn().mockReturnValue(false);

      // When
      controller['renderSubmitResult'](
        Flows.CROSS_DEVICE,
        resultMock,
        reqMock,
        resMock,
      );

      // Then
      expect(resMock.json).toHaveBeenCalledExactlyOnceWith({
        statusCode: 200,
        responseBody: '{}',
        redirectUri: undefined,
      });
    });

    it('should return JSON when the flow is same-device and there is no redirect uri', () => {
      // Given
      reqMock.accepts = jest.fn().mockReturnValue(false);

      // When
      controller['renderSubmitResult'](
        Flows.SAME_DEVICE,
        resultMock,
        reqMock,
        resMock,
      );

      // Then
      expect(resMock.json).toHaveBeenCalledExactlyOnceWith({
        statusCode: 200,
        responseBody: '{}',
        redirectUri: undefined,
      });
    });
  });

  describe('health', () => {
    it('should return the status and the app name', () => {
      // Given
      configMock.get.mockReturnValue({ name: 'MOCK_WALLET' });

      // When
      const result = controller.health();

      // Then
      expect(result).toEqual({ status: 'ok', name: 'MOCK_WALLET' });
    });
  });
});

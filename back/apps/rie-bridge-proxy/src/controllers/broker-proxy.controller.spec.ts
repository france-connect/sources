import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger';

import { BrokerProxyController } from './broker-proxy.controller';

describe('BrokerProxyController', () => {
  let controller: BrokerProxyController;

  const loggerServiceMock = {
    setContext: jest.fn(),
    trace: jest.fn(),
    debug: jest.fn(),
  } as unknown as LoggerService;

  const reqMock = { url: 'https//url.com' };
  const bodyMock = {};
  const headersMock = {};

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrokerProxyController],
      providers: [LoggerService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .compile();

    controller = module.get<BrokerProxyController>(BrokerProxyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get()', () => {
    it('should return partial well-known fake response', async () => {
      // When
      const result = await controller.get(reqMock, bodyMock, headersMock);

      // Then
      expect(result).toEqual({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        authorization_endpoint:
          'https://auth.llng.docker.dev-franceconnect.fr/oauth2/authorize',
      });
    });
  });

  describe('post()', () => {
    it('should return basic confirmation message', async () => {
      // When
      const result = await controller.post(reqMock, bodyMock, headersMock);

      // Then
      expect(result).toEqual({ status: 200, message: 'ok' });
    });
  });
});

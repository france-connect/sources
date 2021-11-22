import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger';

import { OidcProviderGrantSaveException } from '../exceptions';
import { OidcProviderGrantService } from './oidc-provider-grant.service';

describe('OidcProviderGrantService', () => {
  let service: OidcProviderGrantService;

  const interactionIdMock = 'interactionIdMockValue';
  const clientIdMock = 'clientIdMockValue';

  const loggerServiceMock = {
    setContext: jest.fn(),
  } as unknown as LoggerService;

  const reqMock = Symbol('req');
  const resMock = Symbol('res');

  let grantMock;

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggerService, OidcProviderGrantService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .compile();

    service = module.get<OidcProviderGrantService>(OidcProviderGrantService);
  });

  describe('generateGrant', () => {
    let providerMock;

    const interactionDetailsMock = {
      params: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        client_id: clientIdMock,
        scope: 'nautilus u571',
      },
    };

    beforeEach(async () => {
      grantMock = {
        accountId: '',
        clientId: '',
        addOIDCScope: jest.fn(),
      };

      providerMock = {
        // We need to use a function because we want to test the constructor
        Grant: jest.fn().mockImplementation(() => {
          return grantMock;
        }),
        interactionDetails: jest
          .fn()
          .mockReturnValueOnce(interactionDetailsMock),
      };
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
      expect(loggerServiceMock.setContext).toHaveBeenCalledTimes(1);
    });

    it('should call interactionDetail once with req and res', async () => {
      // Given

      // When
      await service.generateGrant(
        providerMock,
        reqMock,
        resMock,
        interactionIdMock,
      );
      // Then
      expect(providerMock.interactionDetails).toHaveBeenCalledTimes(1);
      expect(providerMock.interactionDetails).toHaveBeenCalledWith(
        reqMock,
        resMock,
      );
    });

    it('should call Grant constructor once and set interactionId and clientId', async () => {
      // Given

      // When
      await service.generateGrant(
        providerMock,
        reqMock,
        resMock,
        interactionIdMock,
      );

      // Then
      expect(providerMock.Grant).toHaveBeenCalledTimes(1);
      expect(providerMock.Grant).toHaveBeenCalledTimes(1);
      expect(providerMock.Grant).toHaveBeenCalledWith();
      expect(grantMock.accountId).toEqual(interactionIdMock);
      expect(grantMock.clientId).toEqual(clientIdMock);
    });

    it('should call grant.addOidcScope for each scope', async () => {
      // Given
      const scopesMock = ['nautilus', 'u571'];
      // When
      await service.generateGrant(
        providerMock,
        reqMock,
        resMock,
        interactionIdMock,
      );
      // Then
      expect(grantMock.addOIDCScope).toHaveBeenNthCalledWith(1, scopesMock[0]);
      expect(grantMock.addOIDCScope).toHaveBeenNthCalledWith(2, scopesMock[1]);
    });
  });

  describe('saveGrant', () => {
    beforeEach(() => {
      grantMock = {
        save: jest.fn(),
      };
    });
    it('should save grant', async () => {
      // Given
      const grantSaveMock = 'grantSaveMockValue';
      grantMock.save.mockResolvedValueOnce(grantSaveMock);
      // When
      const result = await service.saveGrant(grantMock);

      expect(result).toEqual(grantSaveMock);
      expect(grantMock.save).toHaveBeenCalledTimes(1);
      expect(grantMock.save).toHaveBeenCalledWith();
    });

    it('should throw an error if grant failed to save', async () => {
      // Given
      const errorMock = new Error('Unknown Error');
      grantMock.save.mockRejectedValueOnce(errorMock);
      // When
      await expect(service.saveGrant(grantMock)).rejects.toThrow(
        OidcProviderGrantSaveException,
      );
    });
  });
});

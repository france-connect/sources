import { Test, TestingModule } from '@nestjs/testing';

import { PartialExcept } from '@fc/common';
import { CryptographyService } from '@fc/cryptography';
import { LoggerService } from '@fc/logger';
import { IOidcIdentity, OidcSession } from '@fc/oidc';

import { SessionCsrfService } from './session-csrf.service';

const interactionIdMock = 'interactionIdMockValue';
const acrMock = 'acrMockValue';
const spNameMock = 'some SP';
const spIdMock = 'spIdMockValue';
const idpStateMock = 'idpStateMockValue';
const idpNonceMock = 'idpNonceMock';
const idpIdMock = 'idpIdMockValue';

const loggerServiceMock = {
  setContext: jest.fn(),
  debug: jest.fn(),
  trace: jest.fn(),
};

const cryptographyServiceMock = {
  encryptSymetric: jest.fn(),
  decryptSymetric: jest.fn(),
  genRandomString: jest.fn(),
};

const randomStringMockValue = 'randomStringMockValue';

const sessionServiceMock = {
  get: jest.fn(),
  set: jest.fn(),
};

const sessionDataMock: OidcSession = {
  interactionId: interactionIdMock,
  csrfToken: randomStringMockValue,

  spAcr: acrMock,
  spId: spIdMock,
  spIdentity: {} as PartialExcept<IOidcIdentity, 'sub'>,
  spName: spNameMock,

  idpId: idpIdMock,
  idpState: idpStateMock,
  idpNonce: idpNonceMock,
};

describe('SessionCsrfService', () => {
  let service: SessionCsrfService;

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [SessionCsrfService, LoggerService, CryptographyService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(CryptographyService)
      .useValue(cryptographyServiceMock)
      .compile();

    service = module.get<SessionCsrfService>(SessionCsrfService);

    cryptographyServiceMock.genRandomString.mockReturnValue(
      randomStringMockValue,
    );
    sessionServiceMock.get.mockResolvedValueOnce(sessionDataMock);
    sessionServiceMock.set.mockResolvedValueOnce(undefined);
  });

  describe('get()', () => {
    it('should return the CSRF Token string value', async () => {
      // Given
      const randomMockValue = 'randomStringMockValue';
      // When
      const result = service.get();
      // Then
      expect(result).toBe(randomMockValue);
    });
  });

  describe('save()', () => {
    it('should update the sessions with the CSRF value', async () => {
      // Given
      const randomMockValue = 'randomStringMockValue';
      // When
      await service.save(sessionServiceMock, randomStringMockValue);
      // Then
      expect(sessionServiceMock.set).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.set).toHaveBeenCalledWith({
        csrfToken: randomMockValue,
      });
    });
  });

  describe('validate()', () => {
    it('should validate the CSRF if the one provided and the one stored in sessions are the same', async () => {
      // When
      const result = await service.validate(
        sessionServiceMock,
        randomStringMockValue,
      );
      // Then
      expect(result).toBeTruthy();
    });

    it('should throw an error if the CSRF token provided and the one stored in session are not the same', async () => {
      // Given
      const randomMockValue = 'csrfToken-BAD-Value';
      const errorMock = new Error(
        'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.',
      );
      // When / Then
      await expect(
        service.validate(sessionServiceMock, randomMockValue),
      ).rejects.toThrow(errorMock);
    });
  });
});

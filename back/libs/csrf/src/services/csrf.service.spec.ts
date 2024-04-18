import { Test, TestingModule } from '@nestjs/testing';

import { CryptographyService } from '@fc/cryptography';
import { SessionService } from '@fc/session';

import { getSessionServiceMock } from '@mocks/session';

import { CsrfBadTokenException } from '../exceptions';
import { CsrfService } from './csrf.service';

const cryptographyServiceMock = {
  genRandomString: jest.fn(),
};

const randomStringMockValue = 'randomStringMockValue';

const sessionServiceMock = getSessionServiceMock();

const sessionDataMock = {
  csrfToken: 'csrfToken Value',
};

describe('CsrfService', () => {
  let service: CsrfService;

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [CsrfService, CryptographyService, SessionService],
    })
      .overrideProvider(CryptographyService)
      .useValue(cryptographyServiceMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .compile();

    service = module.get<CsrfService>(CsrfService);

    cryptographyServiceMock.genRandomString.mockReturnValue(
      randomStringMockValue,
    );
    sessionServiceMock.get.mockReturnValue(sessionDataMock);
  });

  describe('renew()', () => {
    it('should return the CSRF Token string value', () => {
      // Given
      const randomMockValue = 'randomStringMockValue';
      // When
      const result = service.renew();
      // Then
      expect(result).toBe(randomMockValue);
    });
  });

  it('should update the sessions with the CSRF value', () => {
    // Given
    const randomMockValue = 'randomStringMockValue';

    // When
    service.renew();

    // Then
    expect(sessionServiceMock.set).toHaveBeenCalledTimes(1);
    expect(sessionServiceMock.set).toHaveBeenCalledWith('Csrf', {
      csrfToken: randomMockValue,
    });
  });

  describe('check()', () => {
    it('should return true if the token is valid', () => {
      // Given
      service.isValid = jest.fn().mockReturnValueOnce(true);

      // When
      const result = service.check('some value');

      // Then
      expect(result).toBeTrue();
    });

    it('should throw an error if the CSRF token provided and the one stored in session are not the same', () => {
      // Given
      service.isValid = jest.fn().mockReturnValueOnce(false);

      // When / Then
      expect(() => service.check('some value')).toThrow(CsrfBadTokenException);
    });
  });

  describe('isValid()', () => {
    it('should return false if the session is not defined', () => {
      // Given
      sessionServiceMock.get.mockReturnValueOnce(undefined);

      // When
      const result = service.isValid('some value');

      // Then
      expect(result).toBeFalse();
    });

    it('should validate the CSRF if the one provided and the one stored in sessions are the same', () => {
      // When
      const result = service.isValid(sessionDataMock.csrfToken);

      // Then
      expect(result).toBeTrue();
    });

    it('should throw an error if the CSRF token provided and the one stored in session are not the same', () => {
      // Given
      const randomMockValue = 'csrfToken-BAD-Value';

      // When
      const result = service.isValid(randomMockValue);

      // Then
      expect(result).toBeFalse();
    });
  });
});

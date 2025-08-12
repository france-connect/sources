import { Test, TestingModule } from '@nestjs/testing';

import { CryptographyService } from '@fc/cryptography';
import { SessionNotFoundException, SessionService } from '@fc/session';

import { getSessionServiceMock } from '@mocks/session';

import {
  CsrfBadTokenException,
  CsrfConsumedSessionTokenException,
  CsrfMissingTokenException,
  CsrfNoSessionException,
} from '../exceptions';
import { CONSUMED_TOKEN } from '../tokens';
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
    beforeEach(() => {
      service['checkToken'] = jest.fn();
    });

    it('should call checkToken()', () => {
      // Given
      const input = 'input';
      // When
      service.check(input);

      // Then
      expect(service['checkToken']).toHaveBeenCalledExactlyOnceWith(input);
    });

    it('should set the token as consumed', () => {
      // Given
      const input = 'input';

      // When
      service.check(input);

      // Then
      expect(sessionServiceMock.set).toHaveBeenCalledExactlyOnceWith('Csrf', {
        csrfToken: CONSUMED_TOKEN,
      });
    });

    it('should not set the token as consumed if checkToken() throws', () => {
      // Given
      const input = 'input';
      service['checkToken'] = jest.fn().mockImplementation(() => {
        throw new Error();
      });

      // When / Then
      expect(() => service.check(input)).toThrow();
      expect(sessionServiceMock.set).not.toHaveBeenCalled();
    });

    it('should return true', () => {
      // Given
      const input = 'input';

      // When
      const result = service.check(input);

      // Then
      expect(result).toBe(true);
    });
  });

  describe('checkToken()', () => {
    it('should throw CsrfMissingTokenException if the input is falsy', () => {
      // Given
      sessionServiceMock.get.mockReturnValue({ csrfToken: 'csrfToken' });

      // When / Then
      expect(() => service.check('')).toThrow(CsrfMissingTokenException);
    });

    it('should throw SessionNotFoundException if the session does not exist', () => {
      // Given
      sessionServiceMock.get.mockReturnValue(null);

      // When / Then
      expect(() => service.check('input')).toThrow(SessionNotFoundException);
    });

    it('should throw CsrfNoSessionException if the session does not have a token', () => {
      // Given
      sessionServiceMock.get.mockReturnValue({});

      // When / Then
      expect(() => service.check('input')).toThrow(CsrfNoSessionException);
    });

    it('should throw CsrfConsumedTokenException if the token is already consumed', () => {
      // Given
      sessionServiceMock.get.mockReturnValue({ csrfToken: CONSUMED_TOKEN });

      // When / Then
      expect(() => service.check('input')).toThrow(
        CsrfConsumedSessionTokenException,
      );
    });

    it('should throw CsrfBadTokenException if the token is not the expected one', () => {
      // Given
      sessionServiceMock.get.mockReturnValue({ csrfToken: 'anotherToken' });

      // When / Then
      expect(() => service.check('input')).toThrow(CsrfBadTokenException);
    });
  });
});

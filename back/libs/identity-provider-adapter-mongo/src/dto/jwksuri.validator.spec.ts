import { ValidationArguments } from 'class-validator';

import { JwksUriValidator } from './jwksuri.validator';

describe('JwksUriValidator', () => {
  let validator: JwksUriValidator;
  beforeEach(() => {
    validator = new JwksUriValidator();
  });

  describe('validate', () => {
    const ASYMETRIC_ALG = 'RSA512';
    const SYMETRIC_ALG = 'HS512';
    const VALID_URL = 'https://foo.bar';
    const INVALID_URL = 'nope';

    it('should return false if discovery is on, both algs are asym and url is valid', () => {
      // Given
      const dtoInstanceMock = {
        object: {
          discovery: true,
          // OIDC defined name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          userinfo_signed_response_alg: ASYMETRIC_ALG,
          // OIDC defined name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          id_token_signed_response_alg: ASYMETRIC_ALG,
        },
      } as ValidationArguments;
      const jwksUriMock = VALID_URL;
      // When
      const result = validator.validate(jwksUriMock, dtoInstanceMock);
      // Then
      expect(result).toBe(false);
    });

    it('should return false if discovery is on, one alg is asym and url is valid', () => {
      // Given
      const dtoInstanceMock = {
        object: {
          discovery: true,
          // OIDC defined name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          userinfo_signed_response_alg: SYMETRIC_ALG,
          // OIDC defined name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          id_token_signed_response_alg: ASYMETRIC_ALG,
        },
      } as ValidationArguments;
      const jwksUriMock = VALID_URL;
      // When
      const result = validator.validate(jwksUriMock, dtoInstanceMock);
      // Then
      expect(result).toBe(false);
    });

    it('should return false if discovery is on, the other alg is asym and url is valid', () => {
      // Given
      const dtoInstanceMock = {
        object: {
          discovery: true,
          // OIDC defined name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          userinfo_signed_response_alg: ASYMETRIC_ALG,
          // OIDC defined name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          id_token_signed_response_alg: SYMETRIC_ALG,
        },
      } as ValidationArguments;
      const jwksUriMock = VALID_URL;
      // When
      const result = validator.validate(jwksUriMock, dtoInstanceMock);
      // Then
      expect(result).toBe(false);
    });

    it('should return false if discovery is on, both alg are sym and url is valid', () => {
      // Given
      const dtoInstanceMock = {
        object: {
          discovery: true,
          // OIDC defined name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          userinfo_signed_response_alg: SYMETRIC_ALG,
          // OIDC defined name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          id_token_signed_response_alg: SYMETRIC_ALG,
        },
      } as ValidationArguments;
      const jwksUriMock = VALID_URL;
      // When
      const result = validator.validate(jwksUriMock, dtoInstanceMock);
      // Then
      expect(result).toBe(false);
    });

    it('should return true if discovery is on, both alg are asym and url is invalid', () => {
      // Given
      const dtoInstanceMock = {
        object: {
          discovery: true,
          // OIDC defined name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          userinfo_signed_response_alg: ASYMETRIC_ALG,
          // OIDC defined name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          id_token_signed_response_alg: ASYMETRIC_ALG,
        },
      } as ValidationArguments;
      const jwksUriMock = INVALID_URL;
      // When
      const result = validator.validate(jwksUriMock, dtoInstanceMock);
      // Then
      expect(result).toBe(true);
    });

    it('should return true if discovery is on, one alg is asym and url is invalid', () => {
      // Given
      const dtoInstanceMock = {
        object: {
          discovery: true,
          // OIDC defined name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          userinfo_signed_response_alg: SYMETRIC_ALG,
          // OIDC defined name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          id_token_signed_response_alg: ASYMETRIC_ALG,
        },
      } as ValidationArguments;
      const jwksUriMock = INVALID_URL;
      // When
      const result = validator.validate(jwksUriMock, dtoInstanceMock);
      // Then
      expect(result).toBe(true);
    });

    it('should return true if discovery is on, the other alg is asym and url is invalid', () => {
      // Given
      const dtoInstanceMock = {
        object: {
          discovery: true,
          // OIDC defined name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          userinfo_signed_response_alg: ASYMETRIC_ALG,
          // OIDC defined name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          id_token_signed_response_alg: SYMETRIC_ALG,
        },
      } as ValidationArguments;
      const jwksUriMock = INVALID_URL;
      // When
      const result = validator.validate(jwksUriMock, dtoInstanceMock);
      // Then
      expect(result).toBe(true);
    });

    it('should return true if discovery is on, both alg are sym and url is invalid', () => {
      // Given
      const dtoInstanceMock = {
        object: {
          discovery: true,
          // OIDC defined name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          userinfo_signed_response_alg: SYMETRIC_ALG,
          // OIDC defined name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          id_token_signed_response_alg: SYMETRIC_ALG,
        },
      } as ValidationArguments;
      const jwksUriMock = INVALID_URL;
      // When
      const result = validator.validate(jwksUriMock, dtoInstanceMock);
      // Then
      expect(result).toBe(true);
    });

    it('should return true if discovery is off, both alg are asym and url is valid', () => {
      // Given
      const dtoInstanceMock = {
        object: {
          discovery: false,
          // OIDC defined name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          userinfo_signed_response_alg: ASYMETRIC_ALG,
          // OIDC defined name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          id_token_signed_response_alg: ASYMETRIC_ALG,
        },
      } as ValidationArguments;
      const jwksUriMock = VALID_URL;
      // When
      const result = validator.validate(jwksUriMock, dtoInstanceMock);
      // Then
      expect(result).toBe(true);
    });

    it('should return true if discovery is off, one alg is asym and url is valid', () => {
      // Given
      const dtoInstanceMock = {
        object: {
          discovery: false,
          // OIDC defined name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          userinfo_signed_response_alg: SYMETRIC_ALG,
          // OIDC defined name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          id_token_signed_response_alg: ASYMETRIC_ALG,
        },
      } as ValidationArguments;
      const jwksUriMock = VALID_URL;
      // When
      const result = validator.validate(jwksUriMock, dtoInstanceMock);
      // Then
      expect(result).toBe(true);
    });

    it('should return true if discovery is off, the other alg is asym and url is valid', () => {
      // Given
      const dtoInstanceMock = {
        object: {
          discovery: false,
          // OIDC defined name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          userinfo_signed_response_alg: ASYMETRIC_ALG,
          // OIDC defined name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          id_token_signed_response_alg: SYMETRIC_ALG,
        },
      } as ValidationArguments;
      const jwksUriMock = VALID_URL;
      // When
      const result = validator.validate(jwksUriMock, dtoInstanceMock);
      // Then
      expect(result).toBe(true);
    });

    it('should return false if discovery is off, both alg are sym and url is valid', () => {
      // Given
      const dtoInstanceMock = {
        object: {
          discovery: false,
          // OIDC defined name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          userinfo_signed_response_alg: SYMETRIC_ALG,
          // OIDC defined name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          id_token_signed_response_alg: SYMETRIC_ALG,
        },
      } as ValidationArguments;
      const jwksUriMock = VALID_URL;
      // When
      const result = validator.validate(jwksUriMock, dtoInstanceMock);
      // Then
      expect(result).toBe(false);
    });

    it('should return false if discovery is off, both alg are asym and url is invalid', () => {
      // Given
      const dtoInstanceMock = {
        object: {
          discovery: false,
          // OIDC defined name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          userinfo_signed_response_alg: ASYMETRIC_ALG,
          // OIDC defined name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          id_token_signed_response_alg: ASYMETRIC_ALG,
        },
      } as ValidationArguments;
      const jwksUriMock = INVALID_URL;
      // When
      const result = validator.validate(jwksUriMock, dtoInstanceMock);
      // Then
      expect(result).toBe(false);
    });

    it('should return false if discovery is off, one alg is asym and url is invalid', () => {
      // Given
      const dtoInstanceMock = {
        object: {
          discovery: false,
          // OIDC defined name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          userinfo_signed_response_alg: SYMETRIC_ALG,
          // OIDC defined name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          id_token_signed_response_alg: ASYMETRIC_ALG,
        },
      } as ValidationArguments;
      const jwksUriMock = INVALID_URL;
      // When
      const result = validator.validate(jwksUriMock, dtoInstanceMock);
      // Then
      expect(result).toBe(false);
    });

    it('should return false if discovery is off, one alg is asym and url is invalid', () => {
      // Given
      const dtoInstanceMock = {
        object: {
          discovery: false,
          // OIDC defined name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          userinfo_signed_response_alg: ASYMETRIC_ALG,
          // OIDC defined name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          id_token_signed_response_alg: SYMETRIC_ALG,
        },
      } as ValidationArguments;
      const jwksUriMock = INVALID_URL;
      // When
      const result = validator.validate(jwksUriMock, dtoInstanceMock);
      // Then
      expect(result).toBe(false);
    });

    it('should return false if discovery is off, both alg are sym and url is invalid', () => {
      // Given
      const dtoInstanceMock = {
        object: {
          discovery: false,
          // OIDC defined name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          userinfo_signed_response_alg: SYMETRIC_ALG,
          // OIDC defined name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          id_token_signed_response_alg: SYMETRIC_ALG,
        },
      } as ValidationArguments;
      const jwksUriMock = INVALID_URL;
      // When
      const result = validator.validate(jwksUriMock, dtoInstanceMock);
      // Then
      expect(result).toBe(true);
    });
  });

  describe('defaultMessage', () => {
    it('should return the error message', () => {
      // When
      const result = validator.defaultMessage();
      // Then
      expect(result).toBe(
        'JwkURL should not be present with symetric signature algorithms and/or discovery on',
      );
    });
  });
});

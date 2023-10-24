import { validateDto } from '@fc/common';

import { DataProviderAdapterMongoDTO } from './data-provider-adapter-mongo.dto';

const DTO_VALIDATION_OPTIONS = {
  forbidNonWhitelisted: true,
};

describe('Data Provider (Data Transfer Object)', () => {
  const metaDataDpLowMongoMock = {
    uid: '6f21b751-ed06-48b6-a59c-36e1300a368a',
    title: 'Fournisseur de données Mock - 1',
    active: true,
    // OIDC fashion naming
    // eslint-disable-next-line @typescript-eslint/naming-convention
    client_id:
      '423dcbdc5a15ece61ed00ff5989d72379c26d9ed4c8e4e05a87cffae019586e0',
    // OIDC fashion naming
    // eslint-disable-next-line @typescript-eslint/naming-convention
    client_secret:
      'sqGL4XE6aqzIMOp/DKC1jWB8I+8qE1jW6iz2tUv8lt+ZZzxjyoCBQeuAcJTFZxfLywkn6cAICK5JPLxYM0+8pk/q7CGHUfr/gzr3ZYRroWWE+egEEDxqRYDYe0=',
    // OIDC fashion naming
    // eslint-disable-next-line @typescript-eslint/naming-convention
    jwks_uri: 'url.fr/jwks',
    // OIDC fashion naming
    // eslint-disable-next-line @typescript-eslint/naming-convention
    checktoken_endpoint_auth_signing_alg: 'RS256',
    // OIDC fashion naming
    // eslint-disable-next-line @typescript-eslint/naming-convention
    checktoken_encrypted_response_alg: 'RSA-OAEP',
    // OIDC fashion naming
    // eslint-disable-next-line @typescript-eslint/naming-convention
    checktoken_encrypted_response_enc: 'A256GCM',
  };

  describe('should validate data provider', () => {
    it('with only meta data', async () => {
      // When
      const result = await validateDto(
        metaDataDpLowMongoMock,
        DataProviderAdapterMongoDTO,
        DTO_VALIDATION_OPTIONS,
      );
      // Then
      expect(result).toEqual([]);
    });
  });

  describe('should not validate data provider', () => {
    it('with missing properties', async () => {
      // Given
      delete metaDataDpLowMongoMock.client_id;
      // When
      const result = await validateDto(
        metaDataDpLowMongoMock,
        DataProviderAdapterMongoDTO,
        DTO_VALIDATION_OPTIONS,
      );
      // Then
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result[0].property).toBe('client_id');
    });
  });
});

import { validateDto } from '@fc/common';

import {
  DiscoveryIdpAdapterMongoDTO,
  IdentityProviderAdapterMongoDTO,
  MetadataIdpAdapterMongoDTO,
} from './identity-provider-adapter-mongo.dto';

const DTO_VALIDATION_OPTIONS = {
  forbidNonWhitelisted: true,
};

describe('Identity Provider (Data Transfer Object)', () => {
  const metaDataIdPAdapterMongoMock = {
    active: true,
    clientID: 'clientID',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    client_secret: '7vhnwzo1yUVOJT9GJ91gD5oid56effu1',
    discovery: false,
    display: false,
    eidas: 2,
    endSessionURL:
      'https://corev2.docker.dev-franceconnect.fr/api/v2/session/end',
    featureHandlers: {},
    // eslint-disable-next-line @typescript-eslint/naming-convention
    id_token_encrypted_response_alg: 'RSA-OAEP',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    id_token_encrypted_response_enc: 'A256GCM',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    id_token_signed_response_alg: 'RS512',
    image: 'provider1.png',
    name: 'provider1',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    post_logout_redirect_uris: [
      'https://corev2.docker.dev-franceconnect.fr/api/v2/logout-from-provider',
    ],
    // eslint-disable-next-line @typescript-eslint/naming-convention
    redirect_uris: [
      'https://corev2.docker.dev-franceconnect.fr/api/v2/oidc-callback/fip1v2',
    ],
    // eslint-disable-next-line @typescript-eslint/naming-convention
    response_types: ['code'],
    // eslint-disable-next-line @typescript-eslint/naming-convention
    revocation_endpoint_auth_method: 'client_secret_post',
    title: 'provider 1',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    token_endpoint_auth_method: 'client_secret_post',
    uid: 'uid',
    url: 'https://corev2.docker.dev-franceconnect.fr',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    userinfo_encrypted_response_alg: 'RSA-OAEP',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    userinfo_encrypted_response_enc: 'A256GCM',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    userinfo_signed_response_alg: 'RS512',
  };

  const discoveryIdpAdapterMongoMock = {
    ...metaDataIdPAdapterMongoMock,
    discovery: true,
    discoveryUrl: 'https://corev2.docker.dev-franceconnect.fr/well_known_url',
  };

  const identityProviderAdapterMongoMock = {
    ...discoveryIdpAdapterMongoMock,
    authzURL: 'https://corev2.docker.dev-franceconnect.fr/api/v2/authorize',
    discovery: false,
    jwksURL: 'https://corev2.docker.dev-franceconnect.fr/api/v2/jwksURL',
    tokenURL: 'https://corev2.docker.dev-franceconnect.fr/api/v2/token',
    userInfoURL: 'https://corev2.docker.dev-franceconnect.fr/api/v2/userinfo',
  };

  describe('should validate identity provider', () => {
    it('with only meta data', async () => {
      // When | Action
      const result = await validateDto(
        metaDataIdPAdapterMongoMock,
        MetadataIdpAdapterMongoDTO,
        DTO_VALIDATION_OPTIONS,
      );
      // Then | Assert
      expect(result).toEqual([]);
    });

    it('with discovery', async () => {
      // When | Action
      const result = await validateDto(
        discoveryIdpAdapterMongoMock,
        DiscoveryIdpAdapterMongoDTO,
        DTO_VALIDATION_OPTIONS,
      );

      // Then | Assert
      expect(result).toEqual([]);
    });

    it('with all data', async () => {
      // When | Action
      const result = await validateDto(
        identityProviderAdapterMongoMock,
        IdentityProviderAdapterMongoDTO,
        DTO_VALIDATION_OPTIONS,
      );
      // Then | Assert
      expect(result).toEqual([]);
    });

    it('with wrong conditions to get jwksURL', async () => {
      // Given
      const dto = Object.assign(identityProviderAdapterMongoMock, {
        discovery: true,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        id_token_signed_response_alg: 'HS512',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        userinfo_signed_response_alg: 'HS512',
      });
      delete dto.jwksURL;

      // When | Action
      const result = await validateDto(
        dto,
        IdentityProviderAdapterMongoDTO,
        DTO_VALIDATION_OPTIONS,
      );

      // Then | Assert
      expect(result).toEqual([]);
    });
  });

  describe('should not validate', () => {
    it('identity provider with missing discovery property', async () => {
      // When | Action
      const result = await validateDto(
        metaDataIdPAdapterMongoMock,
        DiscoveryIdpAdapterMongoDTO,
        DTO_VALIDATION_OPTIONS,
      );
      // Then | Assert
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result[0].property).toEqual('discoveryUrl');
    });

    it('identity provider with missing openid properties', async () => {
      // When | Action
      const result = await validateDto(
        discoveryIdpAdapterMongoMock,
        IdentityProviderAdapterMongoDTO,
        DTO_VALIDATION_OPTIONS,
      );
      // Then | Assert
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result[0].property).toBe('authzURL');
    });
  });
});

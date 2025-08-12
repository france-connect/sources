import { Test, TestingModule } from '@nestjs/testing';

import { CreatedVia } from '@fc/csmr-config-client';

import {
  ClientTypeEnum,
  EncryptionAlgorithmEnum,
  EncryptionEncodingEnum,
  PlatformTechnicalKeyEnum,
  SignatureAlgorithmEnum,
} from '../enums';
import {
  OidcClientLegacyInterface,
  ServiceProviderClientInterface,
} from '../interfaces';
import { ServiceProviderService } from './service-provider.service';

describe('ServiceProviderService', () => {
  let service: ServiceProviderService;

  const userMock = 'userMock';

  const legacyClient: Partial<OidcClientLegacyInterface> = {
    name: 'name',
    title: 'title',
    claims: ['claims'],
    email: 'email',
    eidas: 1,
    active: true,
    identityConsent: true,
    IPServerAddressesAndRanges: ['IPServerAddressesAndRanges'],
    type: 'private',
    site: ['site'],
    platform: 'CORE_FCP',
    rep_scope: ['rep_scope'],
    key: 'key',
    client_secret: 'client_secret',
    redirect_uris: ['redirect_uris'],
    post_logout_redirect_uris: ['post_logout_redirect_uris'],
    sector_identifier_uri: 'sector_identifier_uri',
    scopes: ['scopes'],
    idpFilterExclude: false,
    idpFilterList: [],
    signup_id: '123456789',
    userinfo_encrypted_response_enc: 'A256GCM',
    userinfo_encrypted_response_alg: 'ECDH-ES',
    userinfo_signed_response_alg: 'ES256',
    id_token_encrypted_response_enc: 'A256GCM',
    id_token_encrypted_response_alg: 'ECDH-ES',
    id_token_signed_response_alg: 'ES256',
    entityId: 'entityId',
    createdBy: userMock,
    createdVia: CreatedVia.EXPLOITATION_BULK_FORM,
    secretUpdatedBy: userMock,
  };

  const v2Client: Partial<ServiceProviderClientInterface> = {
    name: 'name',
    title: 'title',
    claims: ['claims'],
    emails: ['email'],
    eidas: 1,
    active: true,
    identityConsent: true,
    IPServerAddressesAndRanges: ['IPServerAddressesAndRanges'],
    type: ClientTypeEnum.PRIVATE,
    site: ['site'],
    platform: PlatformTechnicalKeyEnum.CORE_FCP,
    rep_scope: ['rep_scope'],
    client_id: 'key',
    client_secret: 'client_secret',
    redirect_uris: ['redirect_uris'],
    post_logout_redirect_uris: ['post_logout_redirect_uris'],
    sector_identifier_uri: 'sector_identifier_uri',
    scope: ['scopes'],
    idpFilterExclude: false,
    idpFilterList: [],
    signupId: '123456789',
    userinfo_encrypted_response_enc: EncryptionEncodingEnum.A256GCM,
    userinfo_encrypted_response_alg: EncryptionAlgorithmEnum.ECDH_ES,
    userinfo_signed_response_alg: SignatureAlgorithmEnum.ES256,
    id_token_encrypted_response_enc: EncryptionEncodingEnum.A256GCM,
    id_token_encrypted_response_alg: EncryptionAlgorithmEnum.ECDH_ES,
    id_token_signed_response_alg: SignatureAlgorithmEnum.ES256,
    entityId: 'entityId',
    createdBy: userMock,
    createdVia: CreatedVia.EXPLOITATION_BULK_FORM,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceProviderService],
    }).compile();

    service = module.get<ServiceProviderService>(ServiceProviderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fromLegacy', () => {
    it('should convert a legacy oidc client to a v2 one', () => {
      // Given
      const {
        createdBy: _createdBy,
        createdVia: _createdVia,
        ...expected
      } = v2Client;

      // When
      const client = service.fromLegacy(legacyClient);

      // Then
      expect(client).toStrictEqual(expected);
    });
  });

  describe('toLegacy', () => {
    it('should convert a v2 oidc client to a legacy one', () => {
      // When
      const client = service.toLegacy(v2Client);

      // Then
      expect(client).toStrictEqual(legacyClient);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';

import {
  ClientTypeEnum,
  EncryptionAlgorithmEnum,
  EncryptionEncodingEnum,
  PlatformTechnicalKeyEnum,
  SignatureAlgorithmEnum,
} from '../enums';
import { OidcClientInterface, OidcClientLegacyInterface } from '../interfaces';
import { ServiceProviderService } from './service-provider.service';

describe('ServiceProviderService', () => {
  let service: ServiceProviderService;

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
  };

  const v2Client: Partial<OidcClientInterface> = {
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
      // When
      const client = service.fromLegacy(legacyClient);

      // Then
      expect(client).toStrictEqual(v2Client);
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

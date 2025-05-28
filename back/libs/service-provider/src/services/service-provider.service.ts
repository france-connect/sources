import { Injectable } from '@nestjs/common';

import {
  ClientTypeEnum,
  EncryptionAlgorithmEnum,
  EncryptionEncodingEnum,
  PlatformTechnicalKeyEnum,
  SignatureAlgorithmEnum,
} from '../enums';
import { OidcClientInterface, OidcClientLegacyInterface } from '../interfaces';

@Injectable()
export class ServiceProviderService {
  fromLegacy(
    input: Partial<OidcClientLegacyInterface>,
  ): Partial<OidcClientInterface> {
    const {
      /**
       * Existing but not yest handled fields
       *
       * This list is here to keep track of existing fields
       *
       * createdAt,
       * secretCreatedAt,
       * updatedAt,
       * updatedBy,
       * description,
       * idClientEmail,
       * secretKeyPhone,
       * contacts,
       * editorName,
       * production_key,
       * signup_id,
       * blacklistByIdentityProviderActivated,
       * whitelistByServiceProviderActivated,
       * whitelistByIdentityProvider,
       * credentialsFlow,
       */
      eidas,
      name,
      title,
      claims,
      email,
      active,
      identityConsent,
      IPServerAddressesAndRanges,
      type,
      site,
      platform,
      rep_scope,
      key: client_id,
      signup_id: signupId,
      client_secret,
      redirect_uris,
      post_logout_redirect_uris,
      sector_identifier_uri,
      scopes: scope,
      idpFilterExclude,
      idpFilterList,
      userinfo_encrypted_response_enc,
      userinfo_encrypted_response_alg,
      userinfo_signed_response_alg,
      id_token_signed_response_alg,
      id_token_encrypted_response_alg,
      id_token_encrypted_response_enc,
      entityId,
    } = input;

    return {
      /**
       * Existing but not yest handled fields
       *
       * This list is here to keep track of existing fields
       *
       * idpFilterExclude,
       * idpFilterList,
       */
      eidas,
      rep_scope,
      type: type as ClientTypeEnum,
      platform: platform as PlatformTechnicalKeyEnum,
      active,
      identityConsent,
      name,
      title,
      emails: email?.split(','),
      site,
      IPServerAddressesAndRanges,
      client_id,
      client_secret,
      redirect_uris,
      post_logout_redirect_uris,
      sector_identifier_uri,
      scope,
      claims,
      idpFilterExclude,
      signupId,
      idpFilterList,
      id_token_signed_response_alg:
        id_token_signed_response_alg as SignatureAlgorithmEnum,
      id_token_encrypted_response_alg:
        id_token_encrypted_response_alg as EncryptionAlgorithmEnum,
      id_token_encrypted_response_enc:
        id_token_encrypted_response_enc as EncryptionEncodingEnum,
      userinfo_signed_response_alg:
        userinfo_signed_response_alg as SignatureAlgorithmEnum,
      userinfo_encrypted_response_alg:
        userinfo_encrypted_response_alg as EncryptionAlgorithmEnum,
      userinfo_encrypted_response_enc:
        userinfo_encrypted_response_enc as EncryptionEncodingEnum,
      entityId,
    };
  }

  toLegacy(
    input: Partial<OidcClientInterface>,
  ): Partial<OidcClientLegacyInterface> {
    const {
      /**
       * Existing but not yest handled fields
       *
       * This list is here to keep track of existing fields
       *
       * jwks_uri,
       */
      eidas,
      rep_scope,
      idpFilterExclude,
      idpFilterList,
      type,
      platform,
      active,
      identityConsent,
      name,
      title,
      emails,
      site,
      IPServerAddressesAndRanges,
      client_id,
      client_secret,
      redirect_uris,
      post_logout_redirect_uris,
      sector_identifier_uri,
      scope,
      claims,
      id_token_signed_response_alg,
      id_token_encrypted_response_alg,
      id_token_encrypted_response_enc,
      userinfo_signed_response_alg,
      userinfo_encrypted_response_alg,
      userinfo_encrypted_response_enc,
      signupId: signup_id,
      entityId,
    } = input;

    return {
      /**
       * Existing but not yest handled fields
       *
       * This list is here to keep track of existing fields
       *
       * createdAt,
       * secretCreatedAt,
       * updatedAt,
       * updatedBy,
       * description,
       * idClientEmail,
       * secretKeyPhone,
       * contacts,
       * editorName,
       * production_key,
       * blacklistByIdentityProviderActivated,
       * whitelistByServiceProviderActivated,
       * whitelistByIdentityProvider,
       * credentialsFlow,
       */
      eidas,
      signup_id,
      name,
      title,
      email: emails?.join(','),
      claims,
      active,
      identityConsent,
      IPServerAddressesAndRanges,
      type,
      site,
      idpFilterExclude,
      idpFilterList,
      platform,
      rep_scope,
      key: client_id,
      client_secret,
      redirect_uris,
      post_logout_redirect_uris,
      sector_identifier_uri,
      scopes: scope,
      userinfo_encrypted_response_enc,
      userinfo_encrypted_response_alg,
      userinfo_signed_response_alg,
      id_token_signed_response_alg,
      id_token_encrypted_response_alg,
      id_token_encrypted_response_enc,
      entityId,
    };
  }
}

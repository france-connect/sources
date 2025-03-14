import { DefaultServiceProviderLowValueConfig } from '@fc/partners';
import {
  cnafMsa,
  cnam,
  cnous,
  dgfip,
  dss,
  fcpLow,
  ft,
  mesri,
  mi,
} from '@fc/scopes';
import {
  ClientTypeEnum,
  EncryptionAlgorithmEnum,
  EncryptionEncodingEnum,
  PlatformTechnicalKeyEnum,
  SignatureAlgorithmEnum,
} from '@fc/service-provider';

export default {
  scope: [
    ...new Set([
      ...Object.keys(fcpLow.scopes),
      ...Object.keys(dgfip.scopes),
      ...Object.keys(cnam.scopes),
      ...Object.keys(cnous.scopes),
      ...Object.keys(mesri.scopes),
      ...Object.keys(mi.scopes),
      ...Object.keys(ft.scopes),
      ...Object.keys(cnafMsa.scopes),
      ...Object.keys(dss.scopes),
    ]),
  ],
  emails: [''],
  claims: ['amr'],
  eidas: 1,
  rep_scope: [],

  platform: PlatformTechnicalKeyEnum.CORE_FCP,

  idpFilterExclude: true,
  idpFilterList: [],

  active: true,
  type: ClientTypeEnum.PUBLIC,
  identityConsent: false,

  id_token_encrypted_response_alg: EncryptionAlgorithmEnum.NONE,
  id_token_encrypted_response_enc: EncryptionEncodingEnum.NONE,
  userinfo_signed_response_alg: SignatureAlgorithmEnum.NONE,
  userinfo_encrypted_response_alg: EncryptionAlgorithmEnum.NONE,
  userinfo_encrypted_response_enc: EncryptionEncodingEnum.NONE,
} as DefaultServiceProviderLowValueConfig;

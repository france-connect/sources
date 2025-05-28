import { ConfigParser } from '@fc/config';
import { DefaultServiceProviderLowValueConfig } from '@fc/csmr-import-core';
import {
  EncryptionAlgorithmEnum,
  EncryptionEncodingEnum,
  PlatformTechnicalKeyEnum,
} from '@fc/service-provider';

const env = new ConfigParser(process.env, 'ServiceProvider');

export default {
  claims: ['amr'],
  eidas: 1,
  rep_scope: [],

  platform: PlatformTechnicalKeyEnum.CORE_FCP,

  idpFilterExclude: env.boolean('IDP_FILTER_EXCLUDE'),
  idpFilterList: env.json('IDP_FILTER_LIST'),

  active: true,

  id_token_encrypted_response_alg: EncryptionAlgorithmEnum.NONE,
  id_token_encrypted_response_enc: EncryptionEncodingEnum.NONE,
  userinfo_encrypted_response_alg: EncryptionAlgorithmEnum.NONE,
  userinfo_encrypted_response_enc: EncryptionEncodingEnum.NONE,
} as DefaultServiceProviderLowValueConfig;

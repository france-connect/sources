import { ClientTypeEnum, SignatureAlgorithmEnum } from '@fc/service-provider';

export interface CsmrImportCoreServiceProviderInterface {
  datapassId: string;
  name: string;
  scopes: string[];
  type: ClientTypeEnum;
  redirect_uris: string[];
  post_logout_redirect_uris: string[];
  userinfo_signed_response_alg:
    | SignatureAlgorithmEnum.ES256
    | SignatureAlgorithmEnum.RS256;
  email: string[];
  phone: string;
  site: string[];
  adressesIp: string[];
  entityId: string;
}

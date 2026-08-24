import { Openid4vpClientIdSchemeEnum } from '../enums';

export const X509_CLIENT_ID_SCHEMES: Openid4vpClientIdSchemeEnum[] = [
  Openid4vpClientIdSchemeEnum.X509_HASH,
  Openid4vpClientIdSchemeEnum.X509_SAN_DNS,
  Openid4vpClientIdSchemeEnum.X509_SAN_URI,
];

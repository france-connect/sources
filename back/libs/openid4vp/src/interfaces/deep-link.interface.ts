import { Openid4vpResponseType } from '../enums';

export interface Openid4vpDeepLinkInterface {
  readonly protocol: 'openid4vp:';
  readonly clientId: string;
  readonly requestUri: string;
  readonly responseType: Openid4vpResponseType;
  readonly state?: string;
  readonly toString: () => string;
}

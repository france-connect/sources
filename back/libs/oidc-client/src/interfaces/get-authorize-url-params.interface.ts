export interface IGetAuthorizeUrlParams {
  state: string;
  scope: string;
  idpId: string;
  // acr_values is an oidc defined variable name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  acr_values: string;
  nonce: string;
  claims?: string;
}

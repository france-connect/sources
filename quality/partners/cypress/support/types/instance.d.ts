export interface Instance extends Record<string, string | string[]> {
  // name attribut in the instance form
  // eslint-disable-next-line @typescript-eslint/naming-convention
  instance_name: string;
  // name attribut in the instance form
  // eslint-disable-next-line @typescript-eslint/naming-convention
  sp_name: string;
  // name attribut in the instance form
  // eslint-disable-next-line @typescript-eslint/naming-convention
  signup_id: string;
  site: string;
  redirect_uris: string;
  post_logout_redirect_uris: string;
  ipAddresses: string;
  id_token_signed_response_alg: string;
  userinfo_signed_response_alg: string;
  // name attribut in the instance form
  // eslint-disable-next-line @typescript-eslint/naming-convention
  use_entity_id: string;
  // name attribut in the instance form
  // eslint-disable-next-line @typescript-eslint/naming-convention
  entity_id?: string;
}

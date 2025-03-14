export interface Instance extends Record<string, string | string[]> {
  name: string;
  platform: string;
  signupId: string;
  site: string;
  redirect_uris: string;
  post_logout_redirect_uris: string;
  IPServerAddressesAndRanges: string;
  id_token_signed_response_alg: string;
  entityId?: string;
}

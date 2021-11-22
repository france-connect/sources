import * as http from 'http';
import { KoaContextWithOIDC } from 'oidc-provider';

export interface OidcCtxRequest extends http.IncomingMessage {
  body: Record<string, string | number | boolean | Array<any>>;
}
export interface OidcCtx extends KoaContextWithOIDC {
  req: OidcCtxRequest;
}

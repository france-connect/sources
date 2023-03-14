import { Request, Response } from 'express';
import { KoaContextWithOIDC } from 'oidc-provider';

import { ISessionRequest, ISessionResponse } from '@fc/session';

export interface OidcCtxRequest extends Request {
  body: Record<string, string | number | boolean | Array<any>>;
}

export interface OidcCtx extends KoaContextWithOIDC {
  req: OidcCtxRequest & ISessionRequest;
  res: Response & ISessionResponse;
}

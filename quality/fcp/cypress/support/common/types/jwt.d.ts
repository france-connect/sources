interface JwtHeader extends Record<string, unknown> {
  alg?: string;
  enc?: string;
  kid?: string;
}

export interface JwtContent {
  jweHeader?: JwtHeader;
  jwsHeader: JwtHeader;
  payload: unknown;
  rawJwt: string;
}

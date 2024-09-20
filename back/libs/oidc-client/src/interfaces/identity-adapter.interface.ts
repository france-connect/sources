import { IdTokenClaims } from 'openid-client';

export type TokenParams = {
  state: string;
  nonce: string;
};

export type ExtraTokenParams = {
  [key: string]: string;
};

export type TokenResults = {
  accessToken: string;
  idToken: string;
  acr: string;
  amr?: string[];
  idpRepresentativeScope?: string[];
};

export type UserInfosParams = {
  accessToken: string;
  idpId: string;
};

type RepScope = {
  rep_scope?: string[];
};

export type IdTokenClaimsWithRepScope = IdTokenClaims & RepScope;

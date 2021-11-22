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
};

export type UserInfosParams = {
  accessToken: string;
  idpId: string;
};

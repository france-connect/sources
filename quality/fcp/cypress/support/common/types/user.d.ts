export interface UserCredentials {
  idpId: string;
  password: string;
  username: string;
}

export interface UserClaims {
  [key: string]: string | string[];
}

export interface UserData {
  enabled: boolean;
  claims: UserClaims;
  credentials: [UserCredentials];
  criteria: string[];
  eidasClaims?: UserClaims;
}

export interface UserCredentials {
  password: string;
  username: string;
}

export interface UserData {
  claims: Record<string, string>;
  credentials: UserCredentials;
  descriptions: string[];
}

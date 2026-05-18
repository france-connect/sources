export interface UserCredentials {
  password: string;
  username: string;
}

export interface UserData {
  claims: Record<string, string | null>;
  credentials: UserCredentials;
  descriptions: string[];
}

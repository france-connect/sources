export interface UserCredentials {
  email: string;
  password: string;
}

export interface User {
  criteria: string[];
  credentials: UserCredentials;
  firstname: string;
  lastname: string;
}

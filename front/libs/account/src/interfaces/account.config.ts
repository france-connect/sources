/* istanbul ignore file */

// declarative file
export interface AccountConfig {
  endpoints: {
    login: string;
    me: string;
    logout: string;
  };
  csrf?: string;
}

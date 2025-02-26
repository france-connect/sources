export interface OidcError extends Record<string, string> {
  readonly error: string;
  readonly error_description?: string;
  readonly state?: string;
  readonly iss?: string;
}
